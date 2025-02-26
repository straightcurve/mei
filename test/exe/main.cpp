#include <GLFW/glfw3.h>
#include <extra.h>
#include <iostream>
#include <stdio.h>

int main() {
  std::cout << add(30, 39) << "\n";

#ifdef HELLO
  printf("XD");
#endif
}
