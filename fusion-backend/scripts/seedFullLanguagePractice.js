import "dotenv/config";
import mongoose from "mongoose";
import CodingQuestion from "../models/CodingQuestion.js";

const languages = ["c", "cpp", "java", "python", "javascript"];
const units = {
  "1": [
    {
      "title": "Add Two Numbers",
      "topic": "Input/output and arithmetic",
      "description": "Read two integers and print their sum.",
      "testcases": [
        [
          "4 7",
          "11"
        ],
        [
          "-5 8",
          "3"
        ]
      ]
    },
    {
      "title": "Even or Odd",
      "topic": "Operators and conditionals",
      "description": "Read an integer and print Even or Odd.",
      "testcases": [
        [
          "8",
          "Even"
        ],
        [
          "13",
          "Odd"
        ]
      ]
    },
    {
      "title": "Largest of Three",
      "topic": "Relational operators and if-else",
      "description": "Read three integers and print the largest.",
      "testcases": [
        [
          "4 9 2",
          "9"
        ],
        [
          "-3 -8 -1",
          "-1"
        ]
      ]
    },
    {
      "title": "Swap Two Numbers",
      "topic": "Variables and assignment",
      "description": "Read two integers, swap them, and print the values in swapped order.",
      "testcases": [
        [
          "3 8",
          "8 3"
        ],
        [
          "-2 5",
          "5 -2"
        ]
      ]
    },
    {
      "title": "Rectangle Perimeter",
      "topic": "Arithmetic expressions",
      "description": "Read length and width and print the perimeter.",
      "testcases": [
        [
          "5 3",
          "16"
        ],
        [
          "7 2",
          "18"
        ]
      ]
    },
    {
      "title": "Quotient and Remainder",
      "topic": "Integer division and modulus",
      "description": "Read two integers a and b (b is non-zero). Print quotient and remainder.",
      "testcases": [
        [
          "17 5",
          "3 2"
        ],
        [
          "20 4",
          "5 0"
        ]
      ]
    },
    {
      "title": "Character ASCII Code",
      "topic": "Characters and type conversion",
      "description": "Read one character and print its ASCII code value.",
      "testcases": [
        [
          "A",
          "65"
        ],
        [
          "a",
          "97"
        ]
      ]
    },
    {
      "title": "Simple Interest",
      "topic": "Arithmetic expressions",
      "description": "Read principal, rate and time as integers. Print simple interest as an integer.",
      "testcases": [
        [
          "1000 5 2",
          "100"
        ],
        [
          "500 4 3",
          "60"
        ]
      ]
    },
    {
      "title": "Positive Negative or Zero",
      "topic": "Comparison operators",
      "description": "Read an integer and print Positive, Negative or Zero.",
      "testcases": [
        [
          "9",
          "Positive"
        ],
        [
          "-4",
          "Negative"
        ],
        [
          "0",
          "Zero"
        ]
      ]
    },
    {
      "title": "Divisible by 5 and 11",
      "topic": "Logical operators",
      "description": "Read an integer. Print Yes if divisible by both 5 and 11, otherwise No.",
      "testcases": [
        [
          "55",
          "Yes"
        ],
        [
          "110",
          "Yes"
        ],
        [
          "25",
          "No"
        ]
      ]
    }
  ],
  "2": [
    {
      "title": "Factorial",
      "topic": "For loop",
      "description": "Read n and print n factorial. Assume 0 <= n <= 12.",
      "testcases": [
        [
          "5",
          "120"
        ],
        [
          "0",
          "1"
        ]
      ]
    },
    {
      "title": "Multiplication Table",
      "topic": "Loops",
      "description": "Read n and print its first 10 multiples separated by spaces.",
      "testcases": [
        [
          "3",
          "3 6 9 12 15 18 21 24 27 30"
        ],
        [
          "1",
          "1 2 3 4 5 6 7 8 9 10"
        ]
      ]
    },
    {
      "title": "Sum from 1 to N",
      "topic": "Loop accumulation",
      "description": "Read n and print the sum of integers from 1 through n.",
      "testcases": [
        [
          "5",
          "15"
        ],
        [
          "10",
          "55"
        ]
      ]
    },
    {
      "title": "Count Digits",
      "topic": "While loop",
      "description": "Read a non-negative integer and print its number of digits. Zero has one digit.",
      "testcases": [
        [
          "5021",
          "4"
        ],
        [
          "0",
          "1"
        ]
      ]
    },
    {
      "title": "Reverse a Number",
      "topic": "While loop and modulus",
      "description": "Read a non-negative integer and print its reverse without leading zeroes.",
      "testcases": [
        [
          "1234",
          "4321"
        ],
        [
          "1200",
          "21"
        ]
      ]
    },
    {
      "title": "Number Palindrome",
      "topic": "Loop and conditions",
      "description": "Read a non-negative integer. Print Yes if it reads the same backward, otherwise No.",
      "testcases": [
        [
          "1221",
          "Yes"
        ],
        [
          "123",
          "No"
        ]
      ]
    },
    {
      "title": "Prime Number Check",
      "topic": "Nested conditions and loops",
      "description": "Read n. Print Prime if n is prime, otherwise Not Prime.",
      "testcases": [
        [
          "7",
          "Prime"
        ],
        [
          "1",
          "Not Prime"
        ],
        [
          "12",
          "Not Prime"
        ]
      ]
    },
    {
      "title": "Fibonacci N Terms",
      "topic": "Loop sequence generation",
      "description": "Read n and print the first n Fibonacci numbers starting with 0 and 1.",
      "testcases": [
        [
          "6",
          "0 1 1 2 3 5"
        ],
        [
          "1",
          "0"
        ]
      ]
    },
    {
      "title": "GCD of Two Numbers",
      "topic": "Loops and Euclidean algorithm",
      "description": "Read two positive integers and print their greatest common divisor.",
      "testcases": [
        [
          "18 24",
          "6"
        ],
        [
          "7 13",
          "1"
        ]
      ]
    },
    {
      "title": "Print a Star Row",
      "topic": "Nested-loop basics",
      "description": "Read n and print n asterisks on one line.",
      "testcases": [
        [
          "5",
          "*****"
        ],
        [
          "3",
          "***"
        ]
      ]
    }
  ],
  "3": [
    {
      "title": "Array Sum",
      "topic": "Arrays and traversal",
      "description": "Read n followed by n integers. Print their sum.",
      "testcases": [
        [
          "5 1 2 3 4 5",
          "15"
        ],
        [
          "3 -1 4 2",
          "5"
        ]
      ]
    },
    {
      "title": "Minimum and Maximum in Array",
      "topic": "Array traversal",
      "description": "Read n and n integers. Print minimum then maximum.",
      "testcases": [
        [
          "5 4 1 9 2 7",
          "1 9"
        ],
        [
          "3 -5 -2 -8",
          "-8 -2"
        ]
      ]
    },
    {
      "title": "Linear Search",
      "topic": "Searching",
      "description": "Read n, n integers and a target. Print its first zero-based index, or -1.",
      "testcases": [
        [
          "5 2 4 6 8 10 6",
          "2"
        ],
        [
          "3 1 3 5 7",
          "-1"
        ]
      ]
    },
    {
      "title": "Reverse an Array",
      "topic": "Array manipulation",
      "description": "Read n and n integers. Print them in reverse order.",
      "testcases": [
        [
          "4 1 2 3 4",
          "4 3 2 1"
        ],
        [
          "3 9 8 7",
          "7 8 9"
        ]
      ]
    },
    {
      "title": "Second Largest Distinct",
      "topic": "Array logic",
      "description": "Read n and n integers. Print the second-largest distinct value. It is guaranteed to exist.",
      "testcases": [
        [
          "5 4 1 9 2 7",
          "7"
        ],
        [
          "4 5 5 3 2",
          "3"
        ]
      ]
    },
    {
      "title": "String Length",
      "topic": "Strings",
      "description": "Read one whitespace-free word and print its length.",
      "testcases": [
        [
          "fusion",
          "6"
        ],
        [
          "Python",
          "6"
        ]
      ]
    },
    {
      "title": "Palindrome String",
      "topic": "String processing",
      "description": "Read one whitespace-free word. Print Yes if it is a palindrome, otherwise No.",
      "testcases": [
        [
          "level",
          "Yes"
        ],
        [
          "hello",
          "No"
        ]
      ]
    },
    {
      "title": "Count Vowels",
      "topic": "String traversal",
      "description": "Read one whitespace-free word and print the number of English vowels, case-insensitive.",
      "testcases": [
        [
          "Education",
          "5"
        ],
        [
          "sky",
          "0"
        ]
      ]
    },
    {
      "title": "Sort Numbers",
      "topic": "Sorting",
      "description": "Read n and n integers. Print them in ascending order.",
      "testcases": [
        [
          "5 4 1 3 2 5",
          "1 2 3 4 5"
        ],
        [
          "4 -1 8 0 3",
          "-1 0 3 8"
        ]
      ]
    },
    {
      "title": "Function: Sum of Digits",
      "topic": "Functions",
      "description": "Read an integer n and print the sum of its digits using a separate function/method.",
      "testcases": [
        [
          "1234",
          "10"
        ],
        [
          "905",
          "14"
        ]
      ]
    }
  ],
  "4": [
    {
      "title": "Rectangle Class",
      "topic": "Classes and objects",
      "description": "Create a Rectangle class with length and width and an area method. Read length and width; print area.",
      "testcases": [
        [
          "5 3",
          "15"
        ],
        [
          "7 2",
          "14"
        ]
      ]
    },
    {
      "title": "Student Grade",
      "topic": "Constructors and methods",
      "description": "Create a Student class/object. Read marks in three subjects and print their total.",
      "testcases": [
        [
          "70 80 90",
          "240"
        ],
        [
          "10 20 30",
          "60"
        ]
      ]
    },
    {
      "title": "Bank Account Transaction",
      "topic": "Encapsulation",
      "description": "Model a bank account balance. Read starting balance and deposit amount; print final balance.",
      "testcases": [
        [
          "1000 250",
          "1250"
        ],
        [
          "0 99",
          "99"
        ]
      ]
    },
    {
      "title": "Inheritance: Employee Salary",
      "topic": "Inheritance",
      "description": "Use an Employee base class and a derived employee with a bonus. Read salary and bonus; print total salary.",
      "testcases": [
        [
          "30000 5000",
          "35000"
        ],
        [
          "25000 0",
          "25000"
        ]
      ]
    },
    {
      "title": "Method Overriding: Area",
      "topic": "Polymorphism",
      "description": "Use a base Shape method and override it for a rectangle. Read length and width; print rectangle area.",
      "testcases": [
        [
          "4 6",
          "24"
        ],
        [
          "9 3",
          "27"
        ]
      ]
    },
    {
      "title": "Safe Division",
      "topic": "Exception handling",
      "description": "Read two integers. Print the integer quotient; if divisor is zero, print Cannot divide.",
      "testcases": [
        [
          "20 4",
          "5"
        ],
        [
          "9 0",
          "Cannot divide"
        ]
      ]
    },
    {
      "title": "Word Frequency",
      "topic": "Maps or dictionaries",
      "description": "Read space-separated words followed by the target word. Print how many times target occurs.",
      "testcases": [
        [
          "red blue red green red red red",
          "3"
        ],
        [
          "a b c b b",
          "2"
        ]
      ]
    },
    {
      "title": "Remove Duplicates",
      "topic": "Sets and collections",
      "description": "Read n and n integers. Print unique values in first-seen order.",
      "testcases": [
        [
          "6 2 1 2 3 1 4",
          "2 1 3 4"
        ],
        [
          "5 5 5 5 5 5",
          "5"
        ]
      ]
    },
    {
      "title": "Recursive Factorial",
      "topic": "Recursion",
      "description": "Read n and print n factorial using recursion. Assume 0 <= n <= 12.",
      "testcases": [
        [
          "5",
          "120"
        ],
        [
          "0",
          "1"
        ]
      ]
    },
    {
      "title": "Matrix Diagonal Sum",
      "topic": "2D arrays",
      "description": "Read n and an n by n matrix. Print the sum of its main diagonal.",
      "testcases": [
        [
          "2 1 2 3 4",
          "5"
        ],
        [
          "3 1 0 0 0 2 0 0 0 3",
          "6"
        ]
      ]
    }
  ]
};

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing. Configure fusion-backend/.env first.");
  await mongoose.connect(uri);
  let inserted = 0, updated = 0;
  for (const language of languages) {
    for (const [unit, questions] of Object.entries(units)) {
      for (const q of questions) {
        const filter = {
          language, category: "practice", title: q.title,
          unit: { $in: [unit, `Unit ${unit}`, `unit ${unit}`] }
        };
        const result = await CodingQuestion.updateOne(filter, { $set: {
          title: q.title,
          description: `[${q.topic}] ${q.description}`,
          language, unit, category: "practice",
          testcases: q.testcases.map(([input, expected]) => ({ input, expected, visible: true })),
          evaluationSteps: [{ stepId: "all-tests", label: "Pass all test cases", type: "all-testcases-pass", value: "", minPassed: 0, marks: 10 }]
        }}, { upsert: true, runValidators: true });
        if (result.upsertedCount) inserted++;
        else if (result.modifiedCount) updated++;
      }
    }
  }
  console.log(`Practice bank ready: ${inserted} inserted, ${updated} updated. 200 questions across 5 languages and 4 units.`);
  await mongoose.disconnect();
};
run().catch(async (error) => {
  console.error("Practice bank seed failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
