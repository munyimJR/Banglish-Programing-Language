// DOM Elements
const sourceCodeTextarea = document.getElementById('sourceCode');
const compileBtn = document.getElementById('compileBtn');
const compileBtnText = document.getElementById('compileBtnText');
const assemblyOutput = document.getElementById('assemblyOutput');
const textOutput = document.getElementById('textOutput');
const keywordsSpan = document.getElementById('keywords');
const identifiersSpan = document.getElementById('identifiers');
const linesSpan = document.getElementById('lines');
const connectionStatus = document.getElementById('connection-status');
const tabs = document.querySelectorAll('.tab');

// API Configuration
const API_URL = 'http://localhost:5000';

console.log('%c=== BANGLA COMPILER LOADED ===', 'color: #10b981; font-size: 18px; font-weight: bold;');
console.log('API URL:', API_URL);

// Default source code
const defaultCode = `dhoro x = 10;
dhoro y = 20;
dhoro sum = x + y;

lekho sum;

jodi (x < y) {
    lekho x;
} jodi na {
    lekho y;
}`;

// Initialize
sourceCodeTextarea.value = defaultCode;
updateLineCount();

// Test server connection on load
setTimeout(checkServerStatus, 1000);

// Event Listeners
compileBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('%c>>> COMPILE BUTTON CLICKED <<<', 'background: #10b981; color: white; padding: 5px; font-size: 14px;');
    compile();
});

sourceCodeTextarea.addEventListener('input', updateLineCount);

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        switchTab(tabName);
    });
});

// Keyboard shortcuts
sourceCodeTextarea.addEventListener('keydown', (e) => {
    // Ctrl+Enter to compile
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        console.log('Keyboard shortcut: Ctrl+Enter');
        compile();
    }
    
    // Tab support
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = sourceCodeTextarea.selectionStart;
        const end = sourceCodeTextarea.selectionEnd;
        const value = sourceCodeTextarea.value;
        sourceCodeTextarea.value = value.substring(0, start) + '    ' + value.substring(end);
        sourceCodeTextarea.selectionStart = sourceCodeTextarea.selectionEnd = start + 4;
    }
});

// Functions
async function checkServerStatus() {
    console.log('[CHECK] Testing backend connection...');
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        console.log('[CHECK] Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('[CHECK] Response data:', data);
            
            if (data.compilerExists) {
                console.log('%c[CHECK] ✅ Backend OK, Compiler found', 'color: #10b981');
                connectionStatus.textContent = 'Backend Status: ✅ Connected';
                connectionStatus.parentElement.parentElement.style.borderColor = '#10b981';
                showNotification('✅ Backend connected successfully!', 'success');
                textOutput.textContent = '// Ready!  Write your code and click Compile';
                assemblyOutput.textContent = '// Assembly code will appear here after compilation...';
            } else {
                console.log('%c[CHECK] ⚠️ Backend OK, Compiler missing', 'color: #f59e0b');
                connectionStatus.textContent = 'Backend Status: ⚠️ Compiler Missing';
                connectionStatus.parentElement.parentElement.style.borderColor = '#f59e0b';
                showNotification('⚠️ Compiler not found on server', 'warning');
                textOutput.textContent = '// ERROR: Compiler not found on server!\n// Please run build script in backend folder';
            }
        } else {
            throw new Error(`Server responded with status ${response.status}`);
        }
    } catch (error) {
        console.error('%c[CHECK] ❌ Connection failed:', error, 'color: #ef4444');
        connectionStatus.textContent = 'Backend Status: ❌ Not Connected';
        connectionStatus.parentElement.parentElement.style.borderColor = '#ef4444';
        showNotification('❌ Cannot connect to backend! ', 'error');
        textOutput.textContent = '// ERROR: Cannot connect to backend server!\n// Make sure the server is running on http://localhost:5000\n// Run: START-ALL. bat';
        assemblyOutput.textContent = '// Backend not responding';
    }
}

function updateLineCount() {
    const lines = sourceCodeTextarea.value.split('\n').length;
    linesSpan.textContent = lines;
}

function switchTab(tabName) {
    console.log('[TAB] Switching to:', tabName);
    
    // Update tab styles
    tabs.forEach(t => t.classList.remove('tab-active'));
    event.target.classList.add('tab-active');
    
    // Show/hide output
    if (tabName === 'assembly') {
        assemblyOutput.style.display = 'block';
        textOutput.style.display = 'none';
    } else {
        assemblyOutput.style.display = 'none';
        textOutput.style.display = 'block';
    }
}

async function compile() {
    console.log('%c========== COMPILATION START ==========', 'background: #000; color: #10b981; font-size: 14px; padding: 5px;');
    
    const code = sourceCodeTextarea.value.trim();
    
    console.log('[COMPILE] Code length:', code.length, 'characters');
    console.log('[COMPILE] Code:\n', code);
    
    if (! code) {
        alert('⚠️ Please enter some code to compile!');
        return;
    }
    
    // Update UI - Start compiling
    console.log('[COMPILE] Updating UI...');
    compileBtn.disabled = true;
    compileBtnText.textContent = 'Compiling...';
    compileBtn.classList.add('loading');
    textOutput.textContent = '⏳ Compiling...\n\nSending request to backend server...';
    assemblyOutput.textContent = '// ⏳ Compiling...';
    
    try {
        const url = `${API_URL}/compile`;
        const requestBody = { code: code };
        
        console.log('[COMPILE] Sending POST request to:', url);
        console.log('[COMPILE] Request body:', requestBody);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        
        console.log('[COMPILE] Response received!');
        console.log('[COMPILE] Response status:', response.status);
        console.log('[COMPILE] Response OK:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        console.log('[COMPILE] Parsing JSON response...');
        const result = await response.json();
        console.log('[COMPILE] Result:', result);
        
        if (result.success) {
            console.log('%c[COMPILE] ✅ COMPILATION SUCCESSFUL!', 'color: #10b981; font-size: 16px; font-weight: bold;');
            
            // Update outputs
            const assembly = result.assembly || '// No assembly code generated';
            const output = result.output || '// No output generated';
            
            console.log('[COMPILE] Assembly code length:', assembly.length);
            console.log('[COMPILE] Output length:', output.length);
            console.log('[COMPILE] Keywords:', result.keywords);
            console.log('[COMPILE] Identifiers:', result.identifiers);
            
            assemblyOutput.textContent = assembly;
            textOutput.textContent = output;
            keywordsSpan.textContent = result.keywords || 0;
            identifiersSpan.textContent = result.identifiers || 0;
            
            console.log('[COMPILE] UI updated successfully');
            showNotification('✅ Compilation successful!', 'success');
        } else {
            console.log('%c[COMPILE] ❌ COMPILATION FAILED', 'color: #ef4444; font-size: 16px; font-weight: bold;');
            console.log('[COMPILE] Error:', result.error);
            
            // Show error
            const errorMsg = result.error || 'Unknown compilation error';
            textOutput.textContent = `❌ Compilation Error:\n\n${errorMsg}`;
            assemblyOutput.textContent = '// Compilation failed - see Output tab for details';
            
            showNotification('❌ Compilation failed!', 'error');
        }
    } catch (error) {
        console.error('%c[COMPILE] ❌ EXCEPTION OCCURRED', 'color: #ef4444; font-size: 16px; font-weight: bold;');
        console.error('[COMPILE] Error type:', error.name);
        console.error('[COMPILE] Error message:', error.message);
        console.error('[COMPILE] Error stack:', error.stack);
        
        // Network or server error
        const errorMsg = `❌ Connection Error\n\n${error.message}\n\nThe backend server is not responding.\nPlease check:\n1. Backend server is running\n2. Server is on http://localhost:5000\n3. No firewall is blocking the connection`;
        
        textOutput.textContent = errorMsg;
        assemblyOutput.textContent = '// Server not responding - see Output tab';
        
        showNotification('❌ Cannot connect to server!', 'error');
    } finally {
        console.log('[COMPILE] Resetting UI...');
        
        // Reset UI
        compileBtn.disabled = false;
        compileBtnText.textContent = 'Compile';
        compileBtn.classList.remove('loading');
        
        console.log('%c========== COMPILATION END ==========', 'background: #000; color: #10b981; font-size: 14px; padding: 5px;');
    }
}

function showNotification(message, type) {
    console.log('[NOTIFICATION]', type.toUpperCase(), ':', message);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0. 3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Set color based on type
    if (type === 'success') {
        notification.style.background = '#10b981';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.background = '#f59e0b';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#ef4444';
        notification.style.color = 'white';
    }
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        .loading {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

console.log('%c✅ Frontend initialized successfully!', 'color: #10b981; font-size: 14px; font-weight: bold;');
console.log('%c📝 Shortcuts: Ctrl+Enter to compile, Tab for indentation', 'color: #3b82f6; font-size: 12px;');
console.log('%c🐛 Open DevTools (F12) to see detailed logs', 'color: #f59e0b; font-size: 12px;');