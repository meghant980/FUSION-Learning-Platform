import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LANGUAGES = [
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
];
const languageLabel = (id) => LANGUAGES.find((item) => item.id === id)?.label || id;

// Concepts are shared across languages. Each language tab changes only the syntax/example.
const TOPICS = [
  {
    unit: 1, chapter: "Programming foundations", title: "Program structure and execution",
    definition: "A program is an ordered set of instructions that tells a computer what to do. The compiler or interpreter translates the source code into actions the computer can execute.",
    explanation: "C and C++ normally begin at main(). Java begins in the main method inside a class. Python and JavaScript can execute statements from the top of a file. Header/import statements make library features available.",
    points: ["Write statements in the correct order.", "Use braces in C, C++, Java and JavaScript; Python uses indentation.", "A semicolon is required for most statements in C, C++, Java and JavaScript, but not normally in Python."],
    examples: {
      c: '#include <stdio.h>\nint main(void) {\n    printf("Hello, FUSION!\\n");\n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, FUSION!" << endl;\n    return 0;\n}',
      java: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, FUSION!");\n    }\n}',
      python: 'print("Hello, FUSION!")',
      javascript: 'console.log("Hello, FUSION!");'
    }, output: "Hello, FUSION!"
  },
  {
    unit: 1, chapter: "Programming foundations", title: "Variables and constants",
    definition: "A variable is a named memory location or named reference used to store a value. A constant is a value that should not be reassigned after it is created.",
    explanation: "Choose meaningful names such as totalMarks or studentName. C, C++ and Java declare types explicitly. Python determines a value's type at runtime. JavaScript uses let for reassignment and const when reassignment is not intended.",
    points: ["Initialize a variable before using it.", "Use constants for fixed values such as PI.", "Variable names are case-sensitive in these languages."],
    examples: {
      c: 'int age = 21;\nconst double PI = 3.14159;',
      cpp: 'int age = 21;\nconst double PI = 3.14159;',
      java: 'int age = 21;\nfinal double PI = 3.14159;',
      python: 'age = 21\nPI = 3.14159  # convention: do not reassign',
      javascript: 'let age = 21;\nconst PI = 3.14159;'
    }, output: "age = 21; PI = 3.14159"
  },
  {
    unit: 1, chapter: "Programming foundations", title: "Data types",
    definition: "A data type describes what kind of value a variable can hold and which operations are valid for it.",
    explanation: "Common types include integer (whole numbers), floating-point (decimal numbers), character, string (text), and boolean (true/false). Exact type names differ between languages. C has char arrays for text; Java uses String; Python and JavaScript have built-in string values.",
    points: ["Use integer types for counts and indexes.", "Use floating-point types for decimal calculations.", "Use boolean values for true/false decisions."],
    examples: {
      c: 'int count = 12;\nfloat price = 19.5f;\nchar grade = \'A\';',
      cpp: '#include <string>\nint count = 12;\ndouble price = 19.5;\nchar grade = \'A\';\nstring name = "Asha";',
      java: 'int count = 12;\ndouble price = 19.5;\nchar grade = \'A\';\nString name = "Asha";\nboolean active = true;',
      python: 'count = 12\nprice = 19.5\ngrade = "A"\nname = "Asha"\nactive = True',
      javascript: 'let count = 12;\nlet price = 19.5;\nlet grade = "A";\nlet name = "Asha";\nlet active = true;'
    }, output: "count: 12, price: 19.5, active: true"
  },
  {
    unit: 1, chapter: "Programming foundations", title: "Input and output",
    definition: "Input is data received by a program. Output is information displayed or returned by a program.",
    explanation: "Input lets a program work with different values instead of fixed values. Output communicates the result. C commonly uses scanf/printf, C++ uses cin/cout, Java uses Scanner/System.out, Python uses input/print, and JavaScript commonly uses prompt/console.log in browser examples.",
    points: ["Convert input text to a number when doing arithmetic.", "Match the input format to the expected data type.", "Print exactly the output format required by a coding question."],
    examples: {
      c: 'int n;\nscanf("%d", &n);\nprintf("Double = %d\\n", n * 2);',
      cpp: 'int n;\ncin >> n;\ncout << "Double = " << n * 2 << endl;',
      java: 'Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nSystem.out.println("Double = " + n * 2);',
      python: 'n = int(input())\nprint("Double =", n * 2)',
      javascript: 'const n = Number(prompt("Enter a number"));\nconsole.log("Double =", n * 2);'
    }, output: "For input 6: Double = 12"
  },
  {
    unit: 1, chapter: "Programming foundations", title: "Operators",
    definition: "Operators are symbols or keywords that perform an operation on one or more values (operands).",
    explanation: "Arithmetic operators perform calculations (+, -, *, /, %). Relational operators compare values (==, !=, >, <, >=, <=). Logical operators combine conditions (&& / and, || / or, ! / not). Assignment operators store or update values (=, +=, -=). The concepts are common, while a few spellings differ in Python.",
    points: ["% returns the remainder and is useful for divisibility checks.", "Use == to compare equality; = assigns a value in most of these languages.", "Use parentheses to make complex expressions easier to read."],
    examples: {
      c: 'int a = 17, b = 5;\nprintf("sum=%d remainder=%d", a + b, a % b);\nif (a > b && b != 0) printf("\nvalid");',
      cpp: 'int a = 17, b = 5;\ncout << "sum=" << a + b << " remainder=" << a % b;\nif (a > b && b != 0) cout << "\\nvalid";',
      java: 'int a = 17, b = 5;\nSystem.out.println("sum=" + (a + b) + " remainder=" + (a % b));\nif (a > b && b != 0) System.out.println("valid");',
      python: 'a, b = 17, 5\nprint("sum=", a + b, "remainder=", a % b)\nif a > b and b != 0:\n    print("valid")',
      javascript: 'const a = 17, b = 5;\nconsole.log("sum=", a + b, "remainder=", a % b);\nif (a > b && b !== 0) console.log("valid");'
    }, output: "sum=22 remainder=2; valid"
  },
  {
    unit: 2, chapter: "Decision making and repetition", title: "if, else and nested conditions",
    definition: "A conditional statement selects which block of code should run based on whether a condition is true or false.",
    explanation: "if checks the first condition. else if / elif checks another condition when earlier conditions are false. else runs when no earlier condition matches. Nested if means placing one condition inside another.",
    points: ["Conditions should evaluate to true or false.", "Order conditions from the most specific to the general when needed.", "Python uses elif and indentation; other examples use else if and braces."],
    examples: {
      c: 'int marks = 72;\nif (marks >= 80) printf("A");\nelse if (marks >= 40) printf("Pass");\nelse printf("Fail");',
      cpp: 'int marks = 72;\nif (marks >= 80) cout << "A";\nelse if (marks >= 40) cout << "Pass";\nelse cout << "Fail";',
      java: 'int marks = 72;\nif (marks >= 80) System.out.println("A");\nelse if (marks >= 40) System.out.println("Pass");\nelse System.out.println("Fail");',
      python: 'marks = 72\nif marks >= 80:\n    print("A")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")',
      javascript: 'const marks = 72;\nif (marks >= 80) console.log("A");\nelse if (marks >= 40) console.log("Pass");\nelse console.log("Fail");'
    }, output: "Pass"
  },
  {
    unit: 2, chapter: "Decision making and repetition", title: "switch / match selection",
    definition: "A multi-way selection statement chooses one branch from several fixed alternatives based on a value.",
    explanation: "C, C++, Java and JavaScript provide switch syntax. Python versions 3.10 and later provide match/case; if/elif is a portable alternative. A break is commonly used in traditional switch statements to prevent fall-through.",
    points: ["Use switch/match when comparing one expression with several known values.", "Use if/else for ranges such as marks >= 40.", "Remember the default branch for unexpected values."],
    examples: {
      c: 'int day = 2;\nswitch (day) {\n  case 1: printf("Mon"); break;\n  case 2: printf("Tue"); break;\n  default: printf("Other");\n}',
      cpp: 'int day = 2;\nswitch (day) {\n  case 1: cout << "Mon"; break;\n  case 2: cout << "Tue"; break;\n  default: cout << "Other";\n}',
      java: 'int day = 2;\nswitch (day) {\n  case 1 -> System.out.println("Mon");\n  case 2 -> System.out.println("Tue");\n  default -> System.out.println("Other");\n}',
      python: 'day = 2\nmatch day:\n    case 1: print("Mon")\n    case 2: print("Tue")\n    case _: print("Other")',
      javascript: 'const day = 2;\nswitch (day) {\n  case 1: console.log("Mon"); break;\n  case 2: console.log("Tue"); break;\n  default: console.log("Other");\n}'
    }, output: "Tue"
  },
  {
    unit: 2, chapter: "Decision making and repetition", title: "for, while and do-while loops",
    definition: "A loop repeats a block of code while a condition is true or for a specified sequence of values.",
    explanation: "for is convenient when iterating over a range or collection. while is useful when the number of repetitions is not known in advance. do-while executes its body at least once in C/C++/Java/JavaScript; Python has no built-in do-while statement.",
    points: ["Update the loop variable so the loop can finish.", "Check boundary conditions carefully to avoid off-by-one errors.", "break exits the loop; continue skips to the next iteration."],
    examples: {
      c: 'for (int i = 1; i <= 3; i++) printf("%d ", i);\nint j = 1;\nwhile (j <= 3) { printf("%d ", j); j++; }',
      cpp: 'for (int i = 1; i <= 3; i++) cout << i << " ";\nint j = 1;\nwhile (j <= 3) { cout << j << " "; j++; }',
      java: 'for (int i = 1; i <= 3; i++) System.out.print(i + " ");\nint j = 1;\nwhile (j <= 3) { System.out.print(j + " "); j++; }',
      python: 'for i in range(1, 4):\n    print(i, end=" ")\nj = 1\nwhile j <= 3:\n    print(j, end=" ")\n    j += 1',
      javascript: 'for (let i = 1; i <= 3; i++) console.log(i);\nlet j = 1;\nwhile (j <= 3) { console.log(j); j++; }'
    }, output: "1 2 3 (from each loop)"
  },
  {
    unit: 2, chapter: "Decision making and repetition", title: "Arrays and lists",
    definition: "An array or list stores multiple values under one name. Each item is accessed using an index, which usually starts at zero.",
    explanation: "C arrays have a fixed size and contain elements of one declared type. C++ has arrays and vector. Java has arrays and collection classes such as ArrayList. Python lists and JavaScript arrays can grow or shrink dynamically.",
    points: ["The first element is usually at index 0.", "For an array of length n, valid indexes are 0 through n-1.", "Use a loop to process every element."],
    examples: {
      c: 'int marks[3] = {70, 80, 90};\nprintf("%d", marks[0]);',
      cpp: '#include <vector>\nvector<int> marks = {70, 80, 90};\ncout << marks[0];',
      java: 'int[] marks = {70, 80, 90};\nSystem.out.println(marks[0]);',
      python: 'marks = [70, 80, 90]\nprint(marks[0])\nmarks.append(95)',
      javascript: 'const marks = [70, 80, 90];\nconsole.log(marks[0]);\nmarks.push(95);'
    }, output: "70"
  },
  {
    unit: 2, chapter: "Decision making and repetition", title: "Strings and common operations",
    definition: "A string is a sequence of characters used to represent text, such as a name, message or address.",
    explanation: "Common string operations include length, indexing, concatenation, comparison and searching. C commonly represents strings as char arrays ending with the null character '\\0'. The other languages provide string types or objects.",
    points: ["Strings may be immutable in a language; create a new string when changing text.", "Be careful with spaces and newline characters in input.", "Use language library methods for safe searching and conversion."],
    examples: {
      c: '#include <string.h>\nchar name[] = "FUSION";\nprintf("%zu", strlen(name));',
      cpp: '#include <string>\nstring name = "FUSION";\ncout << name.length();',
      java: 'String name = "FUSION";\nSystem.out.println(name.length());',
      python: 'name = "FUSION"\nprint(len(name))',
      javascript: 'const name = "FUSION";\nconsole.log(name.length);'
    }, output: "6"
  },
  {
    unit: 3, chapter: "Reusable code and memory", title: "Functions and parameters",
    definition: "A function is a named, reusable block of code that performs a task. Parameters receive input values; a return value sends a result back to the caller.",
    explanation: "Functions reduce repetition and make programs easier to test. A function may return a value or return nothing (void/None). In Java, functions declared inside a class are commonly called methods.",
    points: ["Give a function one clear responsibility.", "Use parameters instead of relying on unrelated global variables.", "The returned value should match the declared return type where types are explicit."],
    examples: {
      c: 'int add(int a, int b) {\n    return a + b;\n}\n// call: add(2, 3)',
      cpp: 'int add(int a, int b) {\n    return a + b;\n}\n// call: add(2, 3)',
      java: 'static int add(int a, int b) {\n    return a + b;\n}\n// call inside main: add(2, 3)',
      python: 'def add(a, b):\n    return a + b\n\nprint(add(2, 3))',
      javascript: 'function add(a, b) {\n    return a + b;\n}\nconsole.log(add(2, 3));'
    }, output: "5"
  },
  {
    unit: 3, chapter: "Reusable code and memory", title: "Recursion and base case",
    definition: "Recursion is a technique in which a function calls itself to solve a smaller version of the same problem.",
    explanation: "Every correct recursive function needs a base case that stops further calls and a recursive case that moves toward the base case. Each call uses stack memory, so very deep recursion can exceed the available stack or recursion limit.",
    points: ["Write the base case first.", "Make sure each call reduces the problem size.", "For large input, an iterative solution may use less stack memory."],
    examples: {
      c: 'int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}',
      cpp: 'int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}',
      java: 'static int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}',
      python: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)',
      javascript: 'function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
    }, output: "factorial(5) = 120"
  },
  {
    unit: 3, chapter: "Reusable code and memory", title: "Pointers and references",
    definition: "A pointer stores the memory address of another value. A reference is another way to access an existing object. This topic is especially important in C and C++.",
    explanation: "In C, & obtains an address and * dereferences a pointer to read or modify the value at that address. C++ supports pointers and references. Java, Python and JavaScript do not expose raw memory pointers for normal application code: variables can hold references to objects, but pointer arithmetic and direct memory access are not available.",
    points: ["Never dereference an uninitialized or null pointer.", "Use NULL in C and nullptr in modern C++ to represent no pointer target.", "Java/Python/JavaScript object variables refer to objects; this is not the same as a C pointer."],
    examples: {
      c: 'int value = 25;\nint *ptr = &value;\nprintf("%d", *ptr);',
      cpp: 'int value = 25;\nint *ptr = &value;\ncout << *ptr;\nint &ref = value; // reference alias',
      java: 'class Box { int value = 25; }\nBox first = new Box();\nBox second = first;\nSystem.out.println(second.value);',
      python: 'items = [25]\nalias = items  # both names refer to the same list\nalias[0] = 30\nprint(items[0])',
      javascript: 'const box = { value: 25 };\nconst alias = box; // object reference\nalias.value = 30;\nconsole.log(box.value);'
    }, output: "C/C++ pointer example: 25; object-reference examples: 30"
  },
  {
    unit: 3, chapter: "Reusable code and memory", title: "Structures, classes and objects",
    definition: "A structure or class groups related data under one user-defined type. An object is a created instance of a class.",
    explanation: "C provides struct to group fields. C++ supports both struct and class. Java, Python and JavaScript support classes and objects. A class can contain data (fields/properties) and behavior (methods).",
    points: ["Use a structure/class when several values describe one entity.", "Create an object/instance before accessing instance members.", "C struct does not provide class inheritance or member methods in the same way as OOP languages."],
    examples: {
      c: 'struct Student { int roll; };\nstruct Student s = {101};\nprintf("%d", s.roll);',
      cpp: 'class Student { public: int roll; };\nStudent s;\ns.roll = 101;\ncout << s.roll;',
      java: 'class Student { int roll; }\nStudent s = new Student();\ns.roll = 101;\nSystem.out.println(s.roll);',
      python: 'class Student:\n    def __init__(self, roll):\n        self.roll = roll\ns = Student(101)\nprint(s.roll)',
      javascript: 'class Student {\n  constructor(roll) { this.roll = roll; }\n}\nconst s = new Student(101);\nconsole.log(s.roll);'
    }, output: "101"
  },
  {
    unit: 3, chapter: "Reusable code and memory", title: "Dynamic memory allocation",
    definition: "Dynamic memory allocation means requesting memory while a program is running instead of deciding every storage size before execution.",
    explanation: "C uses malloc/calloc/realloc and free. C++ commonly uses new/delete, containers such as vector, and smart pointers. Java, Python and JavaScript manage object memory automatically through garbage collection, although developers should still release external resources such as files.",
    points: ["Check whether an allocation succeeded in C/C++.", "Free manually allocated C memory exactly when it is no longer needed.", "Prefer safe containers and managed references where available."],
    examples: {
      c: '#include <stdlib.h>\nint *p = malloc(3 * sizeof(int));\nif (p != NULL) { p[0] = 10; free(p); }',
      cpp: '#include <memory>\nauto p = make_unique<int>(10);\ncout << *p;',
      java: 'int[] values = new int[3];\nvalues[0] = 10;\nSystem.out.println(values[0]);',
      python: 'values = [0] * 3\nvalues[0] = 10\nprint(values[0])',
      javascript: 'const values = new Array(3).fill(0);\nvalues[0] = 10;\nconsole.log(values[0]);'
    }, output: "10"
  },
  {
    unit: 3, chapter: "Reusable code and memory", title: "Searching and sorting",
    definition: "Searching finds a target value in data. Sorting arranges data in a chosen order, such as ascending or descending.",
    explanation: "Linear search checks values one by one and takes O(n) time. Binary search takes O(log n) time but requires sorted data. Bubble sort repeatedly swaps adjacent values and is easy to understand, though it takes O(n²) time in typical cases.",
    points: ["Use binary search only when the data is sorted.", "For real applications, use the language's tested library sort where possible.", "Understand the algorithm before using a built-in method."],
    examples: {
      c: 'int a[] = {2, 4, 6, 8};\nint target = 6, index = -1;\nfor (int i = 0; i < 4; i++)\n    if (a[i] == target) index = i;\nprintf("%d", index);',
      cpp: '#include <algorithm>\nvector<int> a = {8, 2, 6, 4};\nsort(a.begin(), a.end());\nauto it = find(a.begin(), a.end(), 6);',
      java: 'int[] a = {2, 4, 6, 8};\nint index = Arrays.binarySearch(a, 6);',
      python: 'a = [8, 2, 6, 4]\na.sort()\nindex = a.index(6)\nprint(index)',
      javascript: 'const a = [8, 2, 6, 4];\na.sort((x, y) => x - y);\nconst index = a.indexOf(6);\nconsole.log(index);'
    }, output: "Index of 6 in [2, 4, 6, 8] is 2"
  },
  {
    unit: 4, chapter: "Object-oriented and practical programming", title: "OOP: encapsulation, inheritance, polymorphism and abstraction",
    definition: "Object-oriented programming (OOP) organizes software around classes and objects. Its four commonly taught principles are encapsulation, inheritance, polymorphism and abstraction.",
    explanation: "Encapsulation keeps data and related methods together and controls access. Inheritance lets a child class reuse or extend a parent class. Polymorphism lets the same method/interface behave differently for different objects. Abstraction exposes essential behavior while hiding implementation details. C is primarily procedural and does not have built-in class-based OOP.",
    points: ["Use private fields and public methods to protect object state.", "Use inheritance when there is a genuine 'is-a' relationship.", "Use interfaces/abstract classes where supported to define common behavior."],
    examples: {
      c: '/* C uses structs + functions, not built-in classes. */\nstruct Account { int balance; };\nvoid deposit(struct Account *a, int amount) { a->balance += amount; }',
      cpp: 'class Account {\n  int balance = 0;\npublic:\n  void deposit(int n) { balance += n; }\n};',
      java: 'class Account {\n  private int balance = 0;\n  public void deposit(int n) { balance += n; }\n}',
      python: 'class Account:\n    def __init__(self):\n        self.__balance = 0\n    def deposit(self, amount):\n        self.__balance += amount',
      javascript: 'class Account {\n  #balance = 0;\n  deposit(amount) { this.#balance += amount; }\n}'
    }, output: "The account balance changes through the deposit operation."
  },
  {
    unit: 4, chapter: "Object-oriented and practical programming", title: "Constructors and object initialization",
    definition: "A constructor is a special method or function used to initialize a new object with its starting state.",
    explanation: "C does not have class constructors; structures are commonly initialized with assignments or compound literals. C++ and Java use constructor methods with the class name. Python commonly uses __init__. JavaScript classes use constructor().",
    points: ["Initialize fields so an object starts in a valid state.", "Constructors may accept parameters.", "A constructor does not normally return a separate value."],
    examples: {
      c: 'struct Point { int x, y; };\nstruct Point p = {10, 20};',
      cpp: 'class Point { public: int x, y; Point(int a, int b): x(a), y(b) {} };\nPoint p(10, 20);',
      java: 'class Point { int x, y; Point(int a, int b) { x = a; y = b; } }\nPoint p = new Point(10, 20);',
      python: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\np = Point(10, 20)',
      javascript: 'class Point {\n  constructor(x, y) { this.x = x; this.y = y; }\n}\nconst p = new Point(10, 20);'
    }, output: "Point coordinates: (10, 20)"
  },
  {
    unit: 4, chapter: "Object-oriented and practical programming", title: "Exception and error handling",
    definition: "An exception is an event that interrupts the normal flow of a program. Exception handling lets a program respond to certain runtime problems instead of stopping unexpectedly.",
    explanation: "Java, C++, Python and JavaScript provide try/catch or try/except mechanisms. C usually handles errors through return codes, error values, errno and checks such as whether a file pointer is NULL.",
    points: ["Catch only errors you can handle meaningfully.", "Keep cleanup in finally or resource-management constructs where appropriate.", "Validate input before processing it."],
    examples: {
      c: 'FILE *file = fopen("data.txt", "r");\nif (file == NULL) {\n    perror("Could not open file");\n}',
      cpp: 'try {\n    throw runtime_error("Invalid value");\n} catch (const exception& e) {\n    cout << e.what();\n}',
      java: 'try {\n    int n = Integer.parseInt("abc");\n} catch (NumberFormatException e) {\n    System.out.println("Invalid number");\n}',
      python: 'try:\n    n = int("abc")\nexcept ValueError:\n    print("Invalid number")\nfinally:\n    print("Finished")',
      javascript: 'try {\n  JSON.parse("bad");\n} catch (error) {\n  console.log("Invalid data");\n} finally {\n  console.log("Finished");\n}'
    }, output: "Invalid number (handled instead of an unhandled crash)"
  },
  {
    unit: 4, chapter: "Object-oriented and practical programming", title: "File handling",
    definition: "File handling allows a program to store information permanently in a file and read it later.",
    explanation: "Typical steps are open a file, read or write data, then close it. Modes commonly include read, write and append. Python's with statement and Java's try-with-resources help close resources automatically. C uses FILE pointers; C++ provides stream classes.",
    points: ["Check that a file opened successfully.", "Choose append mode when existing contents must be preserved.", "Close files or use automatic resource-management features."],
    examples: {
      c: 'FILE *f = fopen("notes.txt", "w");\nif (f != NULL) {\n    fprintf(f, "Hello file\\n");\n    fclose(f);\n}',
      cpp: '#include <fstream>\nofstream f("notes.txt");\nf << "Hello file\\n";\nf.close();',
      java: 'try (FileWriter f = new FileWriter("notes.txt")) {\n    f.write("Hello file\\n");\n}',
      python: 'with open("notes.txt", "w") as f:\n    f.write("Hello file\\n")',
      javascript: '// Node.js example\nconst fs = require("fs");\nfs.writeFileSync("notes.txt", "Hello file\\n");'
    }, output: "A file named notes.txt contains: Hello file"
  },
  {
    unit: 4, chapter: "Object-oriented and practical programming", title: "Collections, sets and maps",
    definition: "A collection is a data structure that stores multiple values. Different collections provide different rules for order, uniqueness and lookup.",
    explanation: "Lists/arrays keep an ordered sequence and may allow duplicates. Sets keep unique values. Maps/dictionaries store key-value pairs. C commonly uses arrays and custom structures; C++ provides vector, set and map; Java provides ArrayList, HashSet and HashMap; Python has list, set and dict; JavaScript has Array, Set and Map.",
    points: ["Choose a list when order matters.", "Choose a set when values must be unique.", "Choose a map/dictionary for fast lookup by key."],
    examples: {
      c: 'int marks[3] = {70, 80, 90};\n/* Use arrays/structs or a library data structure for maps/sets. */\nprintf("%d", marks[0]);',
      cpp: '#include <vector>\n#include <set>\n#include <map>\nvector<int> marks = {70, 80, 90};\nset<int> uniqueMarks = {70, 80, 90};\nmap<string, int> scores;',
      java: 'ArrayList<Integer> marks = new ArrayList<>();\nmarks.add(70);\nHashSet<Integer> unique = new HashSet<>();\nHashMap<String, Integer> scores = new HashMap<>();',
      python: 'marks = [70, 80, 90]\nunique_marks = {70, 80, 90}\nscores = {"Asha": 90}',
      javascript: 'const marks = [70, 80, 90];\nconst uniqueMarks = new Set(marks);\nconst scores = new Map([["Asha", 90]]);'
    }, output: "List: [70, 80, 90]; unique values: {70, 80, 90}"
  },
];

export default function LanguageNotes() {
  const { language: routeLanguage, unit: routeUnit } = useParams();
  const navigate = useNavigate();
  const initialLanguage = ["c", "cpp", "java", "python", "javascript"].includes(routeLanguage) ? routeLanguage : "c";
  const [language, setLanguage] = useState(initialLanguage);
  const [unit, setUnit] = useState(routeUnit ? String(Number(routeUnit)) : "all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState("1-Program structure and execution");

  const visibleTopics = useMemo(() => TOPICS.filter((topic) => {
    const matchesUnit = unit === "all" || String(topic.unit) === unit;
    const haystack = `${topic.chapter} ${topic.title} ${topic.definition} ${topic.explanation} ${topic.points.join(" ")}`.toLowerCase();
    return matchesUnit && haystack.includes(search.toLowerCase());
  }), [unit, search]);

  const grouped = useMemo(() => visibleTopics.reduce((acc, topic) => {
    (acc[topic.unit] ||= []).push(topic);
    return acc;
  }, {}), [visibleTopics]);

  const copyExample = async (text) => {
    try { await navigator.clipboard.writeText(text); }
    catch { window.alert("Copy is not available in this browser. Select the code and copy it manually."); }
  };

  return (
    <section style={{ marginTop: 22, color: "#202b40" }}>
      <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: 14, padding: "9px 13px", borderRadius: 9, border: "1px solid #dfe3ec", background: "#fff", cursor: "pointer" }}>← Back to Unit</button>
      <div style={{ background: "linear-gradient(120deg,#f2efff,#f7f9ff)", border: "1px solid #e4e1fa", borderRadius: 16, padding: 18, marginBottom: 18 }}>
        <div style={{ color: "#6755c8", fontSize: 12, fontWeight: 900, letterSpacing: 1.5 }}>LEARN THE CONCEPT · THEN SEE THE SYNTAX</div>
        <h2 style={{ margin: "7px 0", fontSize: 24 }}>Programming Language Theory Notes</h2>
        <p style={{ margin: 0, color: "#596579", lineHeight: 1.65 }}>The concept and logic stay mostly the same across languages. Select a language to see how that same concept is written in its syntax. Every chapter includes a definition, explanation, key points, code example and expected output.</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 12 }}>
        {LANGUAGES.map((item) => <button key={item.id} onClick={() => setLanguage(item.id)} style={{ padding: "10px 15px", borderRadius: 10, border: language === item.id ? "2px solid #6755c8" : "1px solid #dfe3ec", background: language === item.id ? "#eeebff" : "white", color: "#202b40", fontWeight: 800, cursor: "pointer" }}>{item.label}</button>)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
        <select aria-label="Filter notes by unit" value={unit} onChange={(event) => setUnit(event.target.value)} style={{ padding: 11, borderRadius: 10, border: "1px solid #dfe3ec", background: "white" }}>
          <option value="all">All units</option>
          {[1, 2, 3, 4].map((number) => <option key={number} value={String(number)}>Unit {number}</option>)}
        </select>
        <input aria-label="Search theory notes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topics (e.g. pointer, loop, OOP)..." style={{ flex: 1, minWidth: 220, padding: 11, borderRadius: 10, border: "1px solid #dfe3ec", background: "white" }} />
      </div>

      {[1, 2, 3, 4].filter((number) => grouped[number]?.length).map((number) => (
        <div key={number} style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, margin: "20px 0 10px" }}>
            <div><div style={{ color: "#6755c8", fontWeight: 900, fontSize: 11, letterSpacing: 1 }}>UNIT {number}</div><h3 style={{ margin: "3px 0", fontSize: 20 }}>{grouped[number][0].chapter}</h3></div>
            <span style={{ color: "#667085", fontSize: 13 }}>{grouped[number].length} chapters</span>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {grouped[number].map((topic, index) => {
              const id = `${number}-${topic.title}`;
              const isOpen = expanded === id;
              return <article key={id} style={{ background: "white", border: "1px solid #e2e6ef", borderRadius: 14, overflow: "hidden", boxShadow: "0 3px 12px rgba(25,35,60,.035)" }}>
                <button onClick={() => setExpanded(isOpen ? "" : id)} aria-expanded={isOpen} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "15px 17px", background: isOpen ? "#faf9ff" : "white", border: 0, textAlign: "left", cursor: "pointer" }}>
                  <span><span style={{ display: "block", color: "#6755c8", fontSize: 11, fontWeight: 900 }}>CHAPTER {index + 1} · UNIT {number}</span><strong style={{ display: "block", marginTop: 4, fontSize: 16, color: "#202b40" }}>{topic.title}</strong></span>
                  <span style={{ fontSize: 20, color: "#6755c8" }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <div style={{ padding: "4px 17px 18px", borderTop: "1px solid #eef0f5" }}>
                  <div style={{ marginTop: 14 }}><div style={{ color: "#6755c8", fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>DEFINITION</div><p style={{ margin: "5px 0 12px", lineHeight: 1.7 }}>{topic.definition}</p></div>
                  <div><div style={{ color: "#6755c8", fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>EXPLANATION</div><p style={{ margin: "5px 0 12px", color: "#596579", lineHeight: 1.7 }}>{topic.explanation}</p></div>
                  <div style={{ background: "#f7f9fc", borderRadius: 10, padding: "11px 14px", marginBottom: 13 }}><strong style={{ fontSize: 13 }}>Important points</strong><ul style={{ margin: "7px 0 0", paddingLeft: 20, color: "#596579", lineHeight: 1.7 }}>{topic.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 7 }}><strong>{languageLabel(language)} code example</strong><button onClick={() => copyExample(topic.examples[language])} style={{ border: 0, borderRadius: 8, padding: "7px 11px", background: "#eeebff", color: "#5744b5", fontWeight: 700, cursor: "pointer" }}>Copy code</button></div>
                  <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto", background: "#172033", color: "#e7ecf5", padding: 14, borderRadius: 10, fontSize: 13, lineHeight: 1.6, margin: 0 }}><code>{topic.examples[language]}</code></pre>
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "#eef8f0", border: "1px solid #d8eddd", borderRadius: 9 }}><strong style={{ color: "#246b3b", fontSize: 12 }}>EXPECTED OUTPUT / RESULT</strong><div style={{ marginTop: 4, color: "#315b3d", whiteSpace: "pre-wrap", fontSize: 13 }}>{topic.output}</div></div>
                </div>}
              </article>;
            })}
          </div>
        </div>
      ))}
      {visibleTopics.length === 0 && <div style={{ background: "white", border: "1px solid #e2e6ef", borderRadius: 12, padding: 22, color: "#667085" }}>No notes found. Try another keyword or select All units.</div>}
      <p style={{ color: "#667085", fontSize: 12, lineHeight: 1.6, marginTop: 18 }}>Study note: These are general learning notes for the listed concepts. Your teacher's official unit syllabus may include additional topics, so use it as the final checklist for exam coverage.</p>
    </section>
  );
}
