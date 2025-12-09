#include <stdio.h>
int main() {
    for(int i = 0; i < 5; i += 1) {
        printf("%d\n", i);
        fflush(stdout);
    }
    return 0;
}
