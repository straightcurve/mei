#include <stdio.h>
#include <extra.h>
#include <iostream>

int main() {
  std::cout << add(30, 39) << "\n";

#ifdef HELLO
  printf("XD");
#endif
}
