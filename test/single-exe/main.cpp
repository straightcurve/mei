#include <iostream>

int main() {
  std::cout << "it works!"
            << "\n";

#ifdef OF_COURSE
  std::cout << "sure it does!"
            << "\n";

#endif
}
