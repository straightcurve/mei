cmake_minimum_required(VERSION 3.15.0)
cmake_policy(SET CMP0091 NEW)
project(mei_project)


# Download xrepo.cmake if not exists in build directory.
if (NOT EXISTS "${CMAKE_BINARY_DIR}/xrepo.cmake")
    message(STATUS "Downloading xrepo.cmake from https://github.com/xmake-io/xrepo-cmake/")
    # mirror https://cdn.jsdelivr.net/gh/xmake-io/xrepo-cmake@main/xrepo.cmake
    file(DOWNLOAD "https://raw.githubusercontent.com/xmake-io/xrepo-cmake/main/xrepo.cmake"
            "${CMAKE_BINARY_DIR}/xrepo.cmake"
            TLS_VERIFY ON)
endif ()

# Include xrepo.cmake so we can use xrepo_package function.
include(${CMAKE_BINARY_DIR}/xrepo.cmake)
    
xrepo_package("glfw")
xrepo_package("glob" CONFIGS "header_only=true")
xrepo_package("joltphysics")
set(CMAKE_CXX_STANDARD 20)
add_library(dawn STATIC "")
set_target_properties(dawn PROPERTIES OUTPUT_NAME "dawn")
xrepo_target_packages(dawn glfw glob joltphysics)
target_include_directories(dawn PUBLIC
  include
  src
)
target_compile_definitions(dawn PUBLIC
  GLFW_INCLUDE_VULKAN
  GLM_ENABLE_EXPERIMENTAL
  GLM_FORCE_DEPTH_ZERO_TO_ONE
  GLM_FORCE_RADIANS
  IMGUI_DEFINE_MATH_OPERATORS
  DAWN_USE_DRAW_INDIRECT
  DAWN_USE_EXCEPTIONS
  GLFW_INCLUDE_NONE
  DAWN_EDITOR
  DAWN_USE_DRAW_INDIRECT
  DAWN_USE_JOLT
  JPH_OBJECT_LAYER_BITS=16
  JPH_PROFILE_ENABLED
  JPH_DEBUG_RENDERER
  JPH_NO_DEBUG
  JPH_OBJECT_STREAM
)
target_compile_options(dawn PUBLIC
  -m64
  -std=c++20
  -msse2
  -fPIC
  -fexceptions
  -g
  -DDEBUG
  -Werror=return-type
  -mfpmath=sse
)
target_link_libraries(dawn PUBLIC
  stdc++
  m
  vulkan
  dbus-1
)
target_link_options(dawn PUBLIC
  -m64
)
target_sources(dawn PRIVATE
  src/extra.cpp
)
