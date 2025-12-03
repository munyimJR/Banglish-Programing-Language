%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void yyerror(const char *s);
int yylex(void);

extern int keyword_count;
extern int line_number;

int identifier_count = 0;
char *identifiers[100];
int values[100];
int label_count = 0;
FILE *output_file;

void add_identifier(char *id) {
    for(int i = 0; i < identifier_count; i++) {
        if(strcmp(identifiers[i], id) == 0) return;
    }
    identifiers[identifier_count] = strdup(id);
    values[identifier_count] = 0;
    identifier_count++;
}

int get_value(char *id) {
    for(int i = 0; i < identifier_count; i++) {
        if(strcmp(identifiers[i], id) == 0) return values[i];
    }
    return 0;
}

void set_value(char *id, int val) {
    for(int i = 0; i < identifier_count; i++) {
        if(strcmp(identifiers[i], id) == 0) {
            values[i] = val;
            return;
        }
    }
}

int get_label() {
    return label_count++;
}
%}

%union {
    int num;
    char *str;
}

%token DHORO LEKHO JODI JODI_NA HOITE
%token <str> IDENTIFIER
%token <num> NUMBER
%token GTE LTE EQ

%type <num> expression

%left '+' '-'
%left '*' '/'

%%

program:
       statement_list
       ;

statement_list:
              statement
              | statement_list statement
              ;

statement:
         declaration
         | print_statement
         | if_statement
         | for_loop
         ;

declaration:
           DHORO IDENTIFIER '=' expression ';' {
               add_identifier($2);
               set_value($2, $4);
               fprintf(output_file, "    ; dhoro %s = %d\n", $2, $4);
               fprintf(output_file, "    mov dword [%s], %d\n", $2, $4);
               printf("Declared: %s = %d\n", $2, $4);
               free($2);
           }
           ;

print_statement:
               LEKHO IDENTIFIER ';' {
                   int val = get_value($2);
                   fprintf(output_file, "    ; lekho %s\n", $2);
                   fprintf(output_file, "    mov eax, [%s]\n", $2);
                   fprintf(output_file, "    call print_num\n");
                   printf("Print: %s = %d\n", $2, val);
                   free($2);
               }
               | LEKHO expression ';' {
                   fprintf(output_file, "    ; lekho %d\n", $2);
                   fprintf(output_file, "    mov eax, %d\n", $2);
                   fprintf(output_file, "    call print_num\n");
                   printf("Print: %d\n", $2);
               }
               ;

if_statement:
            JODI '(' IDENTIFIER '>' expression ')' '{' statement_list '}' {
                int end_label = get_label();
                int val = get_value($3);
                fprintf(output_file, "    ; jodi %s > %d\n", $3, $5);
                fprintf(output_file, "    mov eax, [%s]\n", $3);
                fprintf(output_file, "    cmp eax, %d\n", $5);
                fprintf(output_file, "    jle L%d\n", end_label);
                fprintf(output_file, "L%d:\n", end_label);
                printf("If: %s (%d) > %d = %s\n", $3, val, $5, val > $5 ? "true" : "false");
                free($3);
            }
            | JODI '(' IDENTIFIER '<' expression ')' '{' statement_list '}' {
                int end_label = get_label();
                int val = get_value($3);
                fprintf(output_file, "    ; jodi %s < %d\n", $3, $5);
                fprintf(output_file, "    mov eax, [%s]\n", $3);
                fprintf(output_file, "    cmp eax, %d\n", $5);
                fprintf(output_file, "    jge L%d\n", end_label);
                fprintf(output_file, "L%d:\n", end_label);
                printf("If: %s (%d) < %d = %s\n", $3, val, $5, val < $5 ?  "true" : "false");
                free($3);
            }
            | JODI '(' IDENTIFIER '>' expression ')' '{' statement_list '}' JODI_NA '{' statement_list '}' {
                int else_label = get_label();
                int end_label = get_label();
                int val = get_value($3);
                fprintf(output_file, "    ; jodi-else %s > %d\n", $3, $5);
                fprintf(output_file, "    mov eax, [%s]\n", $3);
                fprintf(output_file, "    cmp eax, %d\n", $5);
                fprintf(output_file, "    jle L%d\n", else_label);
                fprintf(output_file, "    jmp L%d\n", end_label);
                fprintf(output_file, "L%d:\n", else_label);
                fprintf(output_file, "L%d:\n", end_label);
                printf("If-Else: %s (%d) > %d\n", $3, val, $5);
                free($3);
            }
            | JODI '(' IDENTIFIER '<' expression ')' '{' statement_list '}' JODI_NA '{' statement_list '}' {
                int else_label = get_label();
                int end_label = get_label();
                int val = get_value($3);
                fprintf(output_file, "    ; jodi-else %s < %d\n", $3, $5);
                fprintf(output_file, "    mov eax, [%s]\n", $3);
                fprintf(output_file, "    cmp eax, %d\n", $5);
                fprintf(output_file, "    jge L%d\n", else_label);
                fprintf(output_file, "    jmp L%d\n", end_label);
                fprintf(output_file, "L%d:\n", else_label);
                fprintf(output_file, "L%d:\n", end_label);
                printf("If-Else: %s (%d) < %d\n", $3, val, $5);
                free($3);
            }
            ;

for_loop:
        HOITE '(' DHORO IDENTIFIER '=' expression ';' IDENTIFIER '<' expression ';' IDENTIFIER '=' IDENTIFIER '+' expression ')' '{' statement_list '}' {
            add_identifier($4);
            set_value($4, $6);
            
            int loop_start = get_label();
            int loop_end = get_label();
            
            fprintf(output_file, "    ; hoite loop\n");
            fprintf(output_file, "    mov dword [%s], %d\n", $4, $6);
            fprintf(output_file, "L%d:\n", loop_start);
            fprintf(output_file, "    mov eax, [%s]\n", $8);
            fprintf(output_file, "    cmp eax, %d\n", $10);
            fprintf(output_file, "    jge L%d\n", loop_end);
            fprintf(output_file, "    mov eax, [%s]\n", $14);
            fprintf(output_file, "    add eax, %d\n", $16);
            fprintf(output_file, "    mov [%s], eax\n", $12);
            fprintf(output_file, "    jmp L%d\n", loop_start);
            fprintf(output_file, "L%d:\n", loop_end);
            
            printf("Loop: %s from %d to %d\n", $4, $6, $10);
            
            free($4);
            free($8);
            free($12);
            free($14);
        }
        ;

expression:
          NUMBER { 
              $$ = $1; 
          }
          | IDENTIFIER { 
              $$ = get_value($1);
              free($1);
          }
          | expression '+' expression { 
              $$ = $1 + $3; 
          }
          | expression '-' expression { 
              $$ = $1 - $3; 
          }
          | expression '*' expression { 
              $$ = $1 * $3; 
          }
          | expression '/' expression { 
              if($3 != 0) $$ = $1 / $3;
              else { printf("Error: Division by zero\n"); $$ = 0; }
          }
          | '(' expression ')' { 
              $$ = $2; 
          }
          ;

%%

void yyerror(const char *s) {
    fprintf(stderr, "Parse error at line %d: %s\n", line_number, s);
}

int main() {
    // Use a temporary file to capture all the code
    FILE *temp_file = tmpfile();
    if (!temp_file) {
        fprintf(stderr, "Error: Cannot create temp file\n");
        return 1;
    }
    
    output_file = temp_file;
    
    printf("=== Bangla Compiler ===\n");
    printf("Enter code (Ctrl+Z then Enter to finish):\n\n");
    
    int result = yyparse();
    
    // Read all generated code from temp file
    fseek(temp_file, 0, SEEK_END);
    long code_size = ftell(temp_file);
    fseek(temp_file, 0, SEEK_SET);
    
    char *code_buffer = (char*)malloc(code_size + 1);
    if (code_buffer) {
        fread(code_buffer, 1, code_size, temp_file);
        code_buffer[code_size] = '\0';
    }
    fclose(temp_file);
    
    // Now write the final output file with proper structure
    output_file = fopen("output.asm", "w");
    if (!output_file) {
        fprintf(stderr, "Error: Cannot create output.asm\n");
        free(code_buffer);
        return 1;
    }
    
    // Data section
    fprintf(output_file, "section .data\n");
    fprintf(output_file, "    newline db 10, 0\n\n");
    
    // BSS section with all identifiers
    fprintf(output_file, "section .bss\n");
    fprintf(output_file, "    result resb 20\n");
    for(int i = 0; i < identifier_count; i++) {
        fprintf(output_file, "    %s resd 1\n", identifiers[i]);
    }
    fprintf(output_file, "\n");
    
    // Text section with code
    fprintf(output_file, "section .text\n");
    fprintf(output_file, "    global _start\n\n");
    fprintf(output_file, "_start:\n");
    
    // Write the actual program code
    if (code_buffer) {
        fprintf(output_file, "%s", code_buffer);
        free(code_buffer);
    }
    
    // Exit code
    fprintf(output_file, "\n    ; Exit program\n");
    fprintf(output_file, "    mov eax, 1\n");
    fprintf(output_file, "    xor ebx, ebx\n");
    fprintf(output_file, "    int 0x80\n\n");
    
    // Helper functions
    fprintf(output_file, "print_num:\n");
    fprintf(output_file, "    ; Print number routine\n");
    fprintf(output_file, "    ret\n");
    
    fflush(output_file);
    fclose(output_file);
    
    printf("\n=== COMPILATION SUMMARY ===\n");
    printf("KEYWORDS: %d\n", keyword_count);
    printf("IDENTIFIERS: %d\n", identifier_count);
    printf("Assembly: output.asm\n");
    
    return result;
}