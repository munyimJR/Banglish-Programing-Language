%{
#include "parser.tab.h"
#include <string.h>
#include <stdlib.h>

int keyword_count = 0;
int line_number = 1;
%}

%option noyywrap

%%

"dhoro"         { keyword_count++; return DHORO; }
"lekho"         { keyword_count++; return LEKHO; }
"jodi"          { keyword_count++; return JODI; }
"jodi na"       { keyword_count++; return JODI_NA; }
"hoite"         { keyword_count++; return HOITE; }

[a-zA-Z_][a-zA-Z0-9_]*  { yylval.str = strdup(yytext); return IDENTIFIER; }
[0-9]+                  { yylval.num = atoi(yytext); return NUMBER; }

"+"             { return '+'; }
"-"             { return '-'; }
"*"             { return '*'; }
"/"             { return '/'; }
"="             { return '='; }
">"             { return '>'; }
"<"             { return '<'; }
">="            { return GTE; }
"<="            { return LTE; }
"=="            { return EQ; }

"("             { return '('; }
")"             { return ')'; }
"{"             { return '{'; }
"}"             { return '}'; }
";"             { return ';'; }

[ \t]+          ;
\n              { line_number++; }

.               { printf("Unknown character: %s at line %d\n", yytext, line_number); }

%%