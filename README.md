# Banglish Programming Language 🚀

A complete compiler and IDE for programming in Banglish (Bengali). Write code using Bengali keywords, see real-time compilation output, and view generated x86 assembly code - all in an interactive web interface.

Built with Flex, Bison, Node.js, and modern web technologies.

## ✨ Features

### 🔤 Bengali Language Syntax
- **`dhoro`** - Variable declaration
- **`lekho`** - Print statement
- **`jodi` / `jodi na`** - If/else conditions
- **`hoite`** - For loops
- Full arithmetic expressions (`+`, `-`, `*`, `/`)
- Comparison operators (`>`, `<`, `>=`, `<=`, `==`)

### 🖥️ Interactive IDE
- **Syntax-highlighted code editor** with Bengali keywords
- **Live compilation** with Ctrl+Enter shortcut
- **Dual output panels:**
  - Program output with keyword/identifier statistics
  - Generated x86 assembly code view
- **Real-time backend connection status**
- **Tab indentation support**

### ⚙️ Compiler Features
- Lexical analysis with Flex
- Syntax parsing with Bison
- x86 assembly code generation
- Variable tracking and identifier management
- Error reporting and diagnostics

## 📋 Prerequisites

- **Flex & Bison** ([WinFlexBison](https://github.com/lexxmark/winflexbison))
- **GCC** (MinGW or TDM-GCC)
- **Node.js** (v14 or higher)
- **Windows OS** (batch scripts included)

## 🚀 Quick Start

1. **Initial Setup:**
   ```batch
   setup.bat
   ```
   This will:
   - Check for required tools (Flex, Bison, GCC, Node.js)
   - Create necessary directories
   - Build the compiler from parser.y and scanner.l
   - Verify installation

2. **Start the Application:**
   ```batch
   start.bat
   ```
   - Launches the Node.js backend server on port 5000
   - Opens the frontend IDE in your default browser
   - Automatically builds compiler if not found

3. **Write Code:**
   ```bangla
   dhoro x = 10;
   dhoro y = 20;
   dhoro sum = x + y;
   
   lekho sum;
   
   jodi (x < y) {
       lekho x;
   } jodi na {
       lekho y;
   }
   ```

4. **Compile:**
   - Click the **Compile** button or press **Ctrl+Enter**
   - View output in the **Output** tab
   - View assembly code in the **Assembly Code** tab

## 📁 Project Structure

```
Banglish-Programming-Language/
├── backend/
│   ├── server.js           # Node.js Express server
│   ├── parser.y            # Bison grammar rules
│   ├── scanner.l           # Flex lexical analyzer
│   ├── package.json        # Backend dependencies
│   └── compiler.exe        # Compiled compiler (generated)
├── frontend/
│   ├── index.html          # IDE interface
│   ├── script.js           # Frontend logic
│   └── styles.css          # UI styling
├── setup.bat               # Initial setup script
├── start.bat               # Launch application
├── stop.bat                # Stop all processes
├── restart.bat             # Restart application
├── clean.bat               # Clean build files
└── README.md               # This file
```

## 🎮 Usage

### Language Keywords
| Keyword | English | Usage |
|---------|---------|-------|
| `dhoro` | declare | Variable declaration |
| `lekho` | write/print | Output statement |
| `jodi` | if | Conditional statement |
| `jodi na` | else | Alternative condition |
| `hoite` | for | Loop statement |

### Example Programs

**Hello World:**
```bangla
dhoro message = 42;
lekho message;
```

**Conditional:**
```bangla
dhoro age = 18;

jodi (age > 17) {
    lekho age;
} jodi na {
    lekho 0;
}
```

**Loop:**
```bangla
hoite (dhoro i = 0; i < 5; i = i + 1) {
    lekho i;
}
```

**Arithmetic:**
```bangla
dhoro a = 10;
dhoro b = 5;
dhoro sum = a + b;
dhoro diff = a - b;
dhoro prod = a * b;
dhoro div = a / b;

lekho sum;
lekho diff;
lekho prod;
lekho div;
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `setup.bat` | Initial setup and compiler build |
| `start.bat` | Start backend and open frontend |
| `stop.bat` | Stop all Node.js processes |
| `restart.bat` | Restart the application |
| `clean.bat` | Remove generated files |
| `build-backend.bat` | Rebuild compiler only |
| `test-backend.bat` | Test compiler functionality |

## 🔧 Manual Build

If you need to rebuild the compiler manually:

```batch
cd backend
bison -d parser.y
flex scanner.l
gcc -o compiler.exe parser.tab.c lex.yy.c
```

## 🌐 API Endpoints

**Backend Server:** `http://localhost:5000`

- `GET /` - Server status
- `GET /health` - Health check with compiler status
- `POST /compile` - Compile Bangla code
  ```json
  {
    "code": "dhoro x = 10;\nlekho x;"
  }
  ```

## 🐛 Troubleshooting

### Compiler not found
```batch
cd backend
bison -d parser.y
flex scanner.l
gcc -o compiler.exe parser.tab.c lex.yy.c
```

### Backend connection failed
- Ensure Node.js is installed
- Check port 5000 is not in use
- Run `stop.bat` then `start.bat`

### Frontend not updating
- Hard refresh browser (Ctrl+F5)
- Check browser console (F12) for errors
- Verify backend is running

## 📊 Statistics Display

The IDE tracks:
- **Keywords:** Count of Bangla keywords used
- **Identifiers:** Number of unique variables
- **Lines of Code:** Total lines in editor

## 🎨 Features in Detail

### Code Editor
- Syntax-aware text area
- Tab key inserts 4 spaces
- Automatic line counting
- Default example code on load

### Compilation
- Real-time backend communication
- CORS-enabled API
- Detailed error messages
- Loading states and animations

### Output Panels
- Switchable tabs (Output/Assembly)
- Color-coded assembly comments
- Program execution results
- Keyword and identifier counts

## 📝 Technical Details

- **Lexer:** Flex-generated scanner
- **Parser:** Bison LALR(1) parser
- **Target:** x86 assembly (NASM syntax)
- **Backend:** Node.js HTTP server
- **Frontend:** Vanilla JavaScript (no frameworks)
- **Styling:** Modern CSS with animations

## 🤝 Contributing

This is a compiler design project. Feel free to:
- Add more Bengali keywords
- Implement additional operators
- Enhance assembly generation
- Improve error messages
- Add more language features

## 📄 License

MIT License - Feel free to use for educational purposes.

## 🎓 Educational Purpose

This project demonstrates:
- Lexical analysis with Flex
- Syntax parsing with Bison
- Code generation to assembly
- Full-stack web application
- Compiler construction principles
- Language design concepts

---

**Made with ❤️ for Banglish programming enthusiasts**"# Banglish-Programing-Language" 
