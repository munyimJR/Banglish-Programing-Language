const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;

console.log('========================================');
console.log('Bangla Compiler Backend Initializing');
console.log('========================================');

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
    console.log('✓ Created temp directory');
}

const compilerPath = path.join(__dirname, 'compiler.exe');
if (fs.existsSync(compilerPath)) {
    console.log('✓ Compiler found:', compilerPath);
} else {
    console.log('✗ Compiler NOT found:', compilerPath);
}

const server = http.createServer((req, res) => {
    console.log(`\n>>> ${req.method} ${req.url}`);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Bangla Compiler Backend Running on Port ' + PORT);
        return;
    }

    if (parsedUrl.pathname === '/health') {
        const compilerExists = fs.existsSync(compilerPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'OK',
            port: PORT,
            compilerExists: compilerExists,
            timestamp: new Date().toISOString()
        }));
        return;
    }

    if (parsedUrl.pathname === '/compile' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('    Request body received');
            
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Invalid JSON' 
                }));
                return;
            }

            const code = data.code;
            
            if (!code) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'No code provided',
                    assembly: '',
                    output: 'Error: No code provided',
                    keywords: 0,
                    identifiers: 0
                }));
                return;
            }

            console.log('    Compiling code...');

            const timestamp = Date.now();
            const inputFile = path.join(tempDir, `input_${timestamp}.txt`);

                try {
                fs.writeFileSync(inputFile, code);

                if (!fs.existsSync(compilerPath)) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Compiler not found',
                        assembly: '',
                        output: 'Compiler missing! ',
                        keywords: 0,
                        identifiers: 0
                    }));
                    return;
                }

                const command = `"${compilerPath}" < "${inputFile}"`;

                exec(command, { 
                    timeout: 10000,
                    cwd: __dirname 
                }, (error, stdout, stderr) => {
                    console.log('    Compilation completed');
                    
                    let assembly = '';
                    let output = '';
                    let keywords = 0;
                    let identifiers = 0;

                    if (error && !stdout) {
                        output = `Compilation Error:\n${stderr || error.message}`;
                        
                        if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            error: output,
                            assembly: '',
                            output: output,
                            keywords: 0,
                            identifiers: 0
                        }));
                        return;
                    }

                    const asmFile = path.join(__dirname, 'output.asm');
                    if (fs.existsSync(asmFile)) {
                        assembly = fs.readFileSync(asmFile, 'utf8');
                        console.log('    ✓ Assembly generated');
                    } else {
                        assembly = '// No assembly code generated';
                    }

                    output = stdout || 'Compilation completed';
                    const keywordMatch = stdout.match(/KEYWORDS:\s*(\d+)/i);
                    const identifierMatch = stdout.match(/IDENTIFIERS:\s*(\d+)/i);

                    if (keywordMatch) keywords = parseInt(keywordMatch[1]);
                    if (identifierMatch) identifiers = parseInt(identifierMatch[1]);

                    try {
                        if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
                    } catch (e) {}

                    const response = {
                        success: true,
                        assembly: assembly,
                        output: output,
                        keywords: keywords,
                        identifiers: identifiers
                    };

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response));
                });
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: err.message,
                    assembly: '',
                    output: 'Server error',
                    keywords: 0,
                    identifiers: 0
                }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📝 Ready for requests');
    console.log('========================================\n');
});

server.on('error', (error) => {
    console.error('========================================');
    console.error('❌ SERVER ERROR:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use! `);
    }
    console.error('========================================');
});