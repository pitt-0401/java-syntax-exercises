// All practice exercises of the catch-up pack (Part 2 of catch-up.tex), one object per exercise.
// Keep this file in sync with catch-up.tex when you change an exercise there.
//
// Part kinds (how a part is answered and checked):
//   line      one line of Java          -> compared with `answers` (spacing ignored), else the student compares
//   expr      Java expression (Part B)  -> evaluated with the given values AND with `tests`
//   value     a single value            -> number or text compared
//   seq       a list of values          -> "34, 57" == "34 57"
//   seqtable  a table of lists          -> every cell compared
//   choice    pick one option           -> compared
//   lines     program output            -> line by line
//   code      a method / class          -> the student compares with the solution (+ a test file for VS Code)
//   free      a short explanation       -> the student compares with the model answer
//   paper     on paper (e.g., a UML diagram) -> the student compares with the solution
// UML members starting with "_" are static (underlined).

window.SECTIONS = [
  { id: 'A', title: 'One line of Java', time: '10 min',
    task: 'Write <em>one</em> line of Java for each item — a statement, an expression, or a header.' },
  { id: 'B', title: 'Problem statement → Java expression', time: '15 min',
    task: 'Write a Java expression for each item. Use the 3 steps from the cheat sheet: first write it for the <strong>example</strong>, then <strong>with variables</strong>. All variables are already declared.<br>The checker runs your expression with the example values <em>and</em> with other values — just like a method that is called more than once.' },
  { id: 'C', title: 'Arrays, loops & input', time: '50 min', exam: 'like Midterm 2, Q25',
    task: 'Implement each method with the given header. Most of them follow the same pattern:',
    code: `public static RESULT_TYPE name(int[] values) {
    RESULT_TYPE result = START;            // e.g., 0 for a sum, new int[...] for an array
    for (int i = 0; i < values.length; i++) {
        // look at values[i], update result
    }
    return result;
}` },
  { id: 'D', title: 'Trace it', time: '30 min',
    task: 'Trace each piece of code by hand — no computer. This is how sorting, searching, stacks, and queues are asked on the exam.' },
  { id: 'E', title: 'UML ↔ Java', time: '60 min', exam: 'like Midterm 2, Q27',
    task: 'Implement the <strong>highlighted</strong> parts of each class diagram. First translate the diagram line by line (cheat sheet: “Reading UML”) — then add the logic.' },
  { id: 'F', title: 'Debugging', time: '15 min',
    task: 'Each code snippet compiles but does not work as intended (wrong result or crash). For each: (1) write the corrected line of code, (2) briefly explain why the original line is incorrect.' },
];

const BIGO = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'];
const ERRORS = ['compile-time error', 'runtime: ArrayIndexOutOfBoundsException', 'runtime: NullPointerException',
  'runtime: ArithmeticException', 'runtime: InputMismatchException', 'logical error (wrong result, no crash)'];

window.EXERCISES = [
  // ------------------------------------------------------------------ A
  { id: 'A.1', section: 'A', body: 'Declare a private <code>int</code> attribute <code>count</code>.',
    parts: [{ kind: 'line', answers: ['private int count;', 'private int count = 0;'], solution: 'private int count;' }] },
  { id: 'A.2', section: 'A', body: 'Declare and create a <code>double</code> array <code>prices</code> with 5 elements.',
    parts: [{ kind: 'line', answers: ['double[] prices = new double[5];'], solution: 'double[] prices = new double[5];' }] },
  { id: 'A.3', section: 'A', body: 'Declare and initialize an <code>int</code> array <code>numbers</code> with the values 4, 8, and 15.',
    parts: [{ kind: 'line', answers: ['int[] numbers = {4, 8, 15};', 'int[] numbers = new int[]{4, 8, 15};'], solution: 'int[] numbers = {4, 8, 15};' }] },
  { id: 'A.4', section: 'A', body: 'Declare and create a 2D <code>int</code> array <code>grid</code> with 3 rows and 4 columns.',
    parts: [{ kind: 'line', answers: ['int[][] grid = new int[3][4];'], solution: 'int[][] grid = new int[3][4];',
      wrong: [{ answer: 'int[][] grid = new int[4][3];', msg: 'That is 4 rows and 3 columns. The order is always <code>[rows][columns]</code>.' }] }] },
  { id: 'A.5', section: 'A', body: 'Access the <strong>last</strong> element of <code>int[] numbers</code> — for an array of any length.',
    parts: [{ kind: 'line', answers: ['numbers[numbers.length - 1]'], solution: 'numbers[numbers.length - 1]',
      wrong: [{ answer: 'numbers[numbers.length]', msg: 'The last valid index is <code>length - 1</code> → this one throws an <code>ArrayIndexOutOfBoundsException</code>.' }] }] },
  { id: 'A.6', section: 'A', body: 'Write the header of a public static method <code>average</code> that takes an <code>int</code> array <code>scores</code> and returns a <code>double</code>.',
    parts: [{ kind: 'line', answers: ['public static double average(int[] scores)'], solution: 'public static double average(int[] scores)' }] },
  { id: 'A.7', section: 'A', body: 'Write the Java header for the <strong>highlighted</strong> UML method.',
    uml: { classes: [{ name: 'Person', attrs: ['- name: String'], methods: ['+ getName(): String'], hl: { methods: [0] } }] },
    parts: [{ kind: 'line', answers: ['public String getName()'], solution: 'public String getName()' }] },
  { id: 'A.8', section: 'A', body: 'Write the Java header for the <strong>highlighted</strong> UML constructor.',
    uml: { classes: [{ name: 'Book', attrs: ['- title: String', '- pages: int'], methods: ['+ Book(title: String, pages: int)', '+ getTitle(): String'], hl: { methods: [0] } }] },
    parts: [{ kind: 'line', answers: ['public Book(String title, int pages)'], solution: 'public Book(String title, int pages)',
      wrong: [{ answer: 'public void Book(String title, int pages)', msg: 'A constructor has <strong>no</strong> return type — not even <code>void</code>.' }] }] },
  { id: 'A.9', section: 'A', body: 'Write the Java header for the <strong>highlighted</strong> UML method.',
    uml: { classes: [{ name: 'Loan', attrs: ['- rate: double'], methods: ['+ getRate(): double', '+ setRate(rate: double)'], hl: { methods: [1] } }] },
    parts: [{ kind: 'line', answers: ['public void setRate(double rate)'], solution: 'public void setRate(double rate)' }],
    note: 'No return type in UML → <code>void</code>.' },
  { id: 'A.10', section: 'A', body: 'Write the class header of <code>Car</code>, a subclass of <code>Vehicle</code>.',
    parts: [{ kind: 'line', answers: ['public class Car extends Vehicle {'], solution: 'public class Car extends Vehicle {' }] },
  { id: 'A.11', section: 'A', body: 'In <code>Car</code>’s constructor: pass <code>brand</code> to the superclass constructor <code>Vehicle(String brand)</code>.',
    parts: [{ kind: 'line', answers: ['super(brand);'], solution: 'super(brand);' }],
    note: '<code>super(...)</code> must be the <strong>first</strong> line of the constructor.' },
  { id: 'A.12', section: 'A', body: 'Declare and create an empty <code>ArrayList</code> of <code>Integer</code>s called <code>ids</code>.',
    parts: [{ kind: 'line', answers: ['ArrayList<Integer> ids = new ArrayList<>();', 'ArrayList<Integer> ids = new ArrayList<Integer>();'], solution: 'ArrayList<Integer> ids = new ArrayList<>();',
      wrong: [{ answer: 'ArrayList<int> ids = new ArrayList<>();', msg: 'Lists hold objects → use the wrapper class <code>Integer</code>, not <code>int</code>.' }] }] },
  { id: 'A.13', section: 'A', body: 'Create a <code>Scanner</code> called <code>scanner</code> that reads from the keyboard.',
    parts: [{ kind: 'line', answers: ['Scanner scanner = new Scanner(System.in);'], solution: 'Scanner scanner = new Scanner(System.in);' }],
    note: 'Don’t forget <code>import java.util.Scanner;</code> at the top of the file.' },
  { id: 'A.14', section: 'A', body: 'Read a whole line of input into the <code>String</code> <code>line</code>.',
    parts: [{ kind: 'line', answers: ['String line = scanner.nextLine();'], solution: 'String line = scanner.nextLine();',
      wrong: [{ answer: 'String line = scanner.next();', msg: '<code>next()</code> reads only one word (up to the next space). A whole line → <code>nextLine()</code>.' }] }] },
  { id: 'A.15', section: 'A', body: 'Print the <code>double</code> <code>price</code> with exactly 2 decimals, e.g., <code>3.50</code>.',
    parts: [{ kind: 'line', answers: ['System.out.printf("%.2f%n", price);', 'System.out.printf("%.2f", price);', 'System.out.printf("%.2f\\n", price);'], solution: 'System.out.printf("%.2f%n", price);' }] },
  { id: 'A.16', section: 'A', body: 'Check whether the <code>String</code> <code>answer</code> has the text <code>"yes"</code> (a <code>boolean</code> expression).',
    parts: [{ kind: 'line', answers: ['answer.equals("yes")', '"yes".equals(answer)'], solution: 'answer.equals("yes")',
      wrong: [{ answer: 'answer == "yes"', msg: '<code>==</code> compares <em>references</em> (is it the same object?), not the text → use <code>equals</code>.' }] }] },
  { id: 'A.17', section: 'A', body: 'Declare a private static <code>int</code> attribute <code>totalCars</code> that starts at 0.',
    parts: [{ kind: 'line', answers: ['private static int totalCars = 0;', 'private static int totalCars;'], solution: 'private static int totalCars = 0;' }] },
  { id: 'A.18', section: 'A', body: 'Remove the <strong>value</strong> 30 (not the index 30) from <code>ArrayList&lt;Integer&gt; ids</code>.',
    parts: [{ kind: 'line', answers: ['ids.remove(Integer.valueOf(30));', 'ids.remove((Integer) 30);'], solution: 'ids.remove(Integer.valueOf(30));',
      wrong: [{ answer: 'ids.remove(30);', msg: 'With an <code>int</code>, <code>remove(30)</code> removes the element at <strong>index</strong> 30.' }] }] },
  { id: 'A.19', section: 'A', body: 'Print <code>int[] numbers</code> as <code>[4, 8, 15]</code>.',
    parts: [{ kind: 'line', answers: ['System.out.println(Arrays.toString(numbers));'], solution: 'System.out.println(Arrays.toString(numbers));',
      wrong: [{ answer: 'System.out.println(numbers);', msg: 'Printing an array directly prints something like <code>[I@1b6d3586</code> (its reference), not the values.' }] }],
    note: 'Needs <code>import java.util.Arrays;</code>.' },
  { id: 'A.20', section: 'A', body: 'Access the first command-line argument.',
    parts: [{ kind: 'line', answers: ['args[0]', 'String first = args[0];'], solution: 'args[0]' }],
    note: 'No arguments given → <code>args</code> is an empty array (length 0), not <code>null</code>. Then <code>args[0]</code> throws an <code>ArrayIndexOutOfBoundsException</code>.' },

  // ------------------------------------------------------------------ B
  { id: 'B.1', section: 'B', body: 'Calculate the price after a 20 % discount.',
    vars: { price: ['double', 50.0], rate: ['double', 0.20] },
    tests: [{ price: 80.0, rate: 0.25 }, { price: 19.99, rate: 0.1 }],
    ref: 'price * (1 - rate)', exampleSolution: '50.0 * (1 - 0.20)',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '<code>price * rate</code> is what you <em>save</em> (10.0), not what you pay (40.0). <code>price - price * rate</code> also works.' },
  { id: 'B.2', section: 'B', body: 'Calculate the price including 7 % tax.',
    vars: { price: ['double', 50.0], taxRate: ['double', 0.07] },
    tests: [{ price: 100.0, taxRate: 0.25 }, { price: 12.5, taxRate: 0.06 }],
    ref: 'price * (1 + taxRate)', exampleSolution: '50.0 * (1 + 0.07)',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '<code>price + price * taxRate</code> also works.' },
  { id: 'B.3', section: 'B', body: 'Calculate the average of three <code>int</code>s as a <code>double</code>.',
    vars: { a: ['int', 3], b: ['int', 4], c: ['int', 4] },
    tests: [{ a: 1, b: 2, c: 2 }, { a: 10, b: 0, c: 0 }],
    ref: '(a + b + c) / 3.0', exampleSolution: '(3 + 4 + 4) / 3.0',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '<code>/ 3</code> would give <code>3</code>, not <code>3.67</code> (int division).' },
  { id: 'B.4', section: 'B', body: 'Calculate the percentage of correct answers.',
    vars: { correct: ['int', 18], total: ['int', 24] },
    tests: [{ correct: 3, total: 4 }, { correct: 1, total: 3 }],
    ref: 'correct * 100.0 / total', exampleSolution: '18 * 100.0 / 24',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '<code>correct / total * 100</code> is <code>0</code>: <code>18 / 24</code> is already <code>0</code> in int division (see F.3).' },
  { id: 'B.5', section: 'B', body: 'Check whether <code>n</code> is odd (<code>true</code>/<code>false</code>).',
    vars: { n: ['int', 7] },
    tests: [{ n: 10 }, { n: 1 }, { n: 0 }],
    ref: 'n % 2 != 0', exampleSolution: '7 % 2 == 1',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '<code>n % 2 == 1</code> also works for positive <code>n</code>.' },
  { id: 'B.6', section: 'B', body: 'Calculate the full hours in <code>minutes</code>.',
    vars: { minutes: ['int', 135] },
    tests: [{ minutes: 59 }, { minutes: 60 }, { minutes: 200 }],
    ref: 'minutes / 60', exampleSolution: '135 / 60',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: 'Here int division is exactly what you want: <code>135 / 60</code> is <code>2</code>.' },
  { id: 'B.7', section: 'B', body: 'Calculate the minutes left over after the full hours.',
    vars: { minutes: ['int', 135] },
    tests: [{ minutes: 59 }, { minutes: 60 }, { minutes: 200 }],
    ref: 'minutes % 60', exampleSolution: '135 % 60',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '<code>%</code> gives the remainder: 135 = 2 · 60 + <strong>15</strong>.' },
  { id: 'B.8', section: 'B', body: 'Check whether <code>age</code> is between 13 and 19 (inclusive).',
    vars: { age: ['int', 15] },
    tests: [{ age: 13 }, { age: 19 }, { age: 12 }, { age: 20 }],
    ref: 'age >= 13 && age <= 19', exampleSolution: '15 >= 13 && 15 <= 19',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '“Inclusive” → <code>&gt;=</code> and <code>&lt;=</code>. <code>13 &lt;= age &lt;= 19</code> does not compile in Java.' },
  { id: 'B.9', section: 'B', body: 'Raise <code>salary</code> by 3 % (a <strong>statement</strong>, not just an expression).',
    vars: { salary: ['double', 1000.0] },
    tests: [{ salary: 2500.0 }, { salary: 42.0 }],
    ref: 'salary = salary * 1.03;', exampleSolution: '1000.0 * 1.03',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'statement', target: 'salary' }],
    note: '<code>salary *= 1.03;</code> also works. Just <code>salary * 1.03</code> computes the new value — and then throws it away.' },
  { id: 'B.10', section: 'B', body: 'Calculate the weekly pay for more than 40 hours: every hour over 40 is paid at 1.5 × the rate.',
    vars: { hours: ['int', 45], rate: ['double', 20.0] },
    tests: [{ hours: 50, rate: 10.0 }, { hours: 41, rate: 15.0 }],
    ref: '40 * rate + (hours - 40) * rate * 1.5', exampleSolution: '40 * 20.0 + 5 * 20.0 * 1.5',
    parts: [{ kind: 'expr', mode: 'example' }, { kind: 'expr', mode: 'vars' }],
    note: '= <code>950.0</code> (<code>800 + 150</code>). For 40 hours or less, this formula is wrong (30 hours → 500.0 instead of 600.0) — check <code>hours &gt; 40</code> first.' },

  // ------------------------------------------------------------------ C
  { id: 'C.1', section: 'C', title: 'sum',
    body: 'Implement <code>public static int sum(int[] values)</code>: return the sum of all elements.<br><code>sum(new int[]{3, 8, 1, 6})</code> returns <code>18</code>.',
    parts: [{ kind: 'code', starter: 'public static int sum(int[] values) {\n    \n}',
      solution: `public static int sum(int[] values) {
    int total = 0;
    for (int i = 0; i < values.length; i++) {
        total += values[i];
    }
    return total;
}`,
      test: `public class Practice {
    // paste your sum method here

    public static void main(String[] args) {
        System.out.println(sum(new int[]{3, 8, 1, 6}) + "   (expected 18)");
        System.out.println(sum(new int[]{5}) + "   (expected 5)");
        System.out.println(sum(new int[]{}) + "   (expected 0)");
    }
}` }] },
  { id: 'C.2', section: 'C', title: 'average',
    body: 'Implement <code>public static double average(int[] values)</code>: return the average of all elements.<br><code>average(new int[]{3, 8, 1, 6})</code> returns <code>4.5</code> — <strong>not</strong> <code>4.0</code>. Assume the array is not empty.',
    parts: [{ kind: 'code', starter: 'public static double average(int[] values) {\n    \n}',
      solution: `public static double average(int[] values) {
    int sum = 0;
    for (int value : values) {
        sum += value;
    }
    return (double) sum / values.length;   // sum / values.length gives 4.0
}`,
      test: `public class Practice {
    // paste your average method here

    public static void main(String[] args) {
        System.out.println(average(new int[]{3, 8, 1, 6}) + "   (expected 4.5)");
        System.out.println(average(new int[]{1, 2}) + "   (expected 1.5)");
        System.out.println(average(new int[]{7}) + "   (expected 7.0)");
    }
}` }] },
  { id: 'C.3', section: 'C', title: 'countAbove',
    body: 'Implement <code>public static int countAbove(int[] values, int limit)</code>: return the number of elements <strong>greater than</strong> <code>limit</code>.<br><code>countAbove(new int[]{72, 95, 60, 88, 100}, 85)</code> returns <code>3</code>.',
    parts: [{ kind: 'code', starter: 'public static int countAbove(int[] values, int limit) {\n    \n}',
      solution: `public static int countAbove(int[] values, int limit) {
    int count = 0;
    for (int value : values) {
        if (value > limit) {
            count++;
        }
    }
    return count;
}`,
      test: `public class Practice {
    // paste your countAbove method here

    public static void main(String[] args) {
        System.out.println(countAbove(new int[]{72, 95, 60, 88, 100}, 85) + "   (expected 3)");
        System.out.println(countAbove(new int[]{85, 85}, 85) + "   (expected 0)");
        System.out.println(countAbove(new int[]{}, 0) + "   (expected 0)");
    }
}` }],
    note: '“Greater than” → <code>&gt;</code>, not <code>&gt;=</code> (the second test checks exactly this).' },
  { id: 'C.4', section: 'C', title: 'applyDiscount',
    body: 'Implement <code>public static double[] applyDiscount(double[] prices, double rate)</code>: return a <strong>new</strong> array with the discounted prices. Do not modify <code>prices</code>.<br><code>applyDiscount(new double[]{40.0, 10.0, 25.0}, 0.25)</code> returns <code>{30.0, 7.5, 18.75}</code>.',
    parts: [{ kind: 'code', starter: 'public static double[] applyDiscount(double[] prices, double rate) {\n    \n}',
      solution: `public static double[] applyDiscount(double[] prices, double rate) {
    double[] result = new double[prices.length];   // same size as the input
    for (int i = 0; i < prices.length; i++) {
        result[i] = prices[i] * (1 - rate);
    }
    return result;
}`,
      test: `import java.util.Arrays;

public class Practice {
    // paste your applyDiscount method here

    public static void main(String[] args) {
        double[] prices = {40.0, 10.0, 25.0};
        System.out.println(Arrays.toString(applyDiscount(prices, 0.25)) + "   (expected [30.0, 7.5, 18.75])");
        System.out.println(Arrays.toString(prices) + "   (expected [40.0, 10.0, 25.0])");
    }
}` }],
    note: 'The second test line checks that <code>prices</code> was not modified.' },
  { id: 'C.5', section: 'C', title: 'sharePercent',
    body: 'Implement <code>public static double[] sharePercent(int[] votes)</code>: each element is a number of votes. Return each element’s share of all votes (in percent).<br><code>sharePercent(new int[]{1, 3, 4})</code> returns <code>{12.5, 37.5, 50.0}</code>.<br><em>Idea: two loops — first the total, then the shares.</em>',
    parts: [{ kind: 'code', starter: 'public static double[] sharePercent(int[] votes) {\n    \n}',
      solution: `public static double[] sharePercent(int[] votes) {
    int total = 0;
    for (int v : votes) {
        total += v;
    }
    double[] shares = new double[votes.length];
    for (int i = 0; i < votes.length; i++) {
        shares[i] = votes[i] * 100.0 / total;   // part * 100.0 / whole
    }
    return shares;
}`,
      test: `import java.util.Arrays;

public class Practice {
    // paste your sharePercent method here

    public static void main(String[] args) {
        System.out.println(Arrays.toString(sharePercent(new int[]{1, 3, 4})) + "   (expected [12.5, 37.5, 50.0])");
        System.out.println(Arrays.toString(sharePercent(new int[]{1, 1, 2})) + "   (expected [25.0, 25.0, 50.0])");
    }
}` }] },
  { id: 'C.6', section: 'C', title: 'rowAverages (2D)',
    body: 'Implement <code>public static double[] rowAverages(int[][] scores)</code>: return the average of each row. Rows can have <strong>different lengths</strong>!',
    code: `int[][] scores = { {80, 90, 100}, {70, 75, 80, 85}, {60, 65} };
rowAverages(scores)   // returns {90.0, 77.5, 62.5}`,
    parts: [{ kind: 'code', starter: 'public static double[] rowAverages(int[][] scores) {\n    \n}',
      solution: `public static double[] rowAverages(int[][] scores) {
    double[] averages = new double[scores.length];          // one per ROW
    for (int i = 0; i < scores.length; i++) {
        int sum = 0;                                        // reset for every row
        for (int j = 0; j < scores[i].length; j++) {        // THIS row's length
            sum += scores[i][j];
        }
        averages[i] = (double) sum / scores[i].length;      // without the cast: 77.0
    }
    return averages;
}`,
      test: `import java.util.Arrays;

public class Practice {
    // paste your rowAverages method here

    public static void main(String[] args) {
        int[][] scores = { {80, 90, 100}, {70, 75, 80, 85}, {60, 65} };
        System.out.println(Arrays.toString(rowAverages(scores)) + "   (expected [90.0, 77.5, 62.5])");
    }
}` }] },
  { id: 'C.7', section: 'C', title: 'columnTotals (2D)',
    body: 'Implement <code>public static int[] columnTotals(int[][] sales)</code>: return the total of each <strong>column</strong> (same <code>sales</code> as in Midterm 2, Q25). Assume that all rows have the same length.',
    code: `int[][] sales = { {10, 20, 30, 40}, {15, 25, 35, 45}, {5, 10, 15, 20} };
columnTotals(sales)   // returns {30, 55, 80, 105}`,
    parts: [
      { kind: 'value', label: '(a) How many elements does the returned array contain?', answer: 4 },
      { kind: 'line', label: '(a) … and which expression gives you that number (for any <code>sales</code>)?', answers: ['sales[0].length'], solution: 'sales[0].length',
        wrong: [{ answer: 'sales.length', msg: '<code>sales.length</code> is the number of <strong>rows</strong> (3). You need the number of columns.' }] },
      { kind: 'code', label: '(b) Implement the method.', starter: 'public static int[] columnTotals(int[][] sales) {\n    \n}',
        solution: `public static int[] columnTotals(int[][] sales) {
    int[] totals = new int[sales[0].length];            // one per COLUMN
    for (int col = 0; col < sales[0].length; col++) {   // outer loop: columns
        for (int row = 0; row < sales.length; row++) {  // inner loop: rows
            totals[col] += sales[row][col];             // still [row][col]
        }
    }
    return totals;
}`,
        test: `import java.util.Arrays;

public class Practice {
    // paste your columnTotals method here

    public static void main(String[] args) {
        int[][] sales = { {10, 20, 30, 40}, {15, 25, 35, 45}, {5, 10, 15, 20} };
        System.out.println(Arrays.toString(columnTotals(sales)) + "   (expected [30, 55, 80, 105])");
    }
}` }],
    note: 'The index order is always <code>[row][col]</code>, whichever loop is outside.' },
  { id: 'C.8', section: 'C', title: 'Input & arrays: main',
    body: 'Implement a <code>main</code> method that<ul><li>reads 5 scores (whole numbers) from the keyboard into an <code>int</code> array,</li><li>rejects input that is not a whole number and asks again (<code>hasNextInt()</code>),</li><li>prints the average with 2 decimals.</li></ul>',
    code: `Score 1: 80
Score 2: abc
Whole number, please: 90
...
Average: 80.00`, codeLang: 'text',
    parts: [{ kind: 'code', starter: 'public static void main(String[] args) {\n    \n}',
      solution: `public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);   // import java.util.Scanner;
    int[] scores = new int[5];
    for (int i = 0; i < scores.length; i++) {
        System.out.print("Score " + (i + 1) + ": ");
        while (!scanner.hasNextInt()) {
            scanner.next();                     // discard the bad token
            System.out.print("Whole number, please: ");
        }
        scores[i] = scanner.nextInt();
    }
    scanner.close();
    int sum = 0;
    for (int score : scores) {
        sum += score;
    }
    System.out.printf("Average: %.2f%n", (double) sum / scores.length);
}`,
      testNote: 'Run it in VS Code and type <code>80</code>, <code>abc</code>, <code>90</code>, <code>70</code>, <code>85</code>, <code>75</code> → <code>Average: 80.00</code>.' }],
    note: 'Without <code>scanner.next()</code> in the loop, the bad token stays in the input → endless loop.' },

  // ------------------------------------------------------------------ D
  { id: 'D.1', section: 'D', title: 'Sorting: pass by pass',
    body: 'Write down the array after each pass of the <strong>outer</strong> loop (code: cheat sheet, “Sorting algorithms”). Separate the numbers with spaces or commas.',
    parts: [{ kind: 'seqtable', start: '29 10 14 37 13', cols: ['SelectionSort', 'BubbleSort', 'InsertionSort'],
      rows: ['after pass 1', 'after pass 2', 'after pass 3'],
      answers: [['10 29 14 37 13', '10 14 29 13 37', '10 29 14 37 13'],
                ['10 13 14 37 29', '10 14 13 29 37', '10 14 29 37 13'],
                ['10 13 14 37 29', '10 13 14 29 37', '10 14 29 37 13']] }],
    note: 'SelectionSort pass 3: 14 is already the smallest of the rest → it swaps with itself. InsertionSort pass 3: 37 is already in place.' },
  { id: 'D.2', section: 'D', title: 'Binary search',
    body: '<code>int[] values = {3, 8, 15, 21, 34, 42, 57, 63, 78};</code> (indices 0–8), code: cheat sheet, “Big-O &amp; binary search”.',
    parts: [
      { kind: 'seq', label: '(a) <code>binarySearch(values, 57)</code>: values of <code>values[mid]</code> in order', answer: ['34', '57'] },
      { kind: 'value', label: '(a) returns', answer: 6 },
      { kind: 'seq', label: '(b) <code>binarySearch(values, 10)</code>: values of <code>values[mid]</code> in order', answer: ['34', '8', '15'] },
      { kind: 'value', label: '(b) returns', answer: -1 },
      { kind: 'choice', label: '(c) Why does binary search not work on <code>{8, 3, 21}</code>?',
        options: ['The array is too short.', 'The array is not sorted.', 'The length is odd.', '21 is too large.'], answer: 1 }],
    note: '(a) mid = (0 + 8) / 2 = 4 → 34; 57 &gt; 34 → left = 5; mid = (5 + 8) / 2 = 6 → 57. (b) 34 → 8 → 15, then left &gt; right → -1.' },
  { id: 'D.3', section: 'D', title: 'Big-O',
    body: 'Give the worst-case Big-O for an array <code>values</code> with <em>n</em> elements.',
    parts: [
      { kind: 'choice', label: '(a) <code>int x = values[3];</code>', options: BIGO, answer: 0 },
      { kind: 'choice', label: '(b) <code>for (int i = 0; i &lt; n; i++) { sum += values[i]; }</code>', options: BIGO, answer: 2 },
      { kind: 'choice', label: '(c) <code>for (int i = 0; i &lt; n; i++) { for (int j = 0; j &lt; n; j++) { … } }</code>', options: BIGO, answer: 4 },
      { kind: 'choice', label: '(d) <code>for (int i = n; i &gt; 1; i = i / 2) { … }</code>', options: BIGO, answer: 1 },
      { kind: 'choice', label: '(e) two loops <strong>one after the other</strong>, each <code>i = 0</code> to <code>n - 1</code>', options: BIGO, answer: 2 }],
    note: '(e): n + n = 2n steps → constants do not count → O(n). Nested loops multiply, loops in a row add.' },
  { id: 'D.4', section: 'D', title: 'Stack & queue',
    parts: [
      { kind: 'seq', label: '(a) <code>push(5); push(2); push(8); pop(); push(6); pop(); pop();</code><br>Values returned by the <code>pop()</code> calls', answer: ['8', '6', '2'] },
      { kind: 'seq', label: '(a) Stack at the end', answer: ['5'] },
      { kind: 'seq', label: '(b) <code>enqueue(5); enqueue(2); enqueue(8); dequeue(); enqueue(6); dequeue();</code><br>Values returned by the <code>dequeue()</code> calls', answer: ['5', '2'] },
      { kind: 'seq', label: '(b) Queue at the end (front first)', answer: ['8', '6'] }],
    note: 'Stack: last in, first out (LIFO). Queue: first in, first out (FIFO).' },
  { id: 'D.5', section: 'D', title: 'What happens?',
    body: 'For each line: compile-time error, runtime error (which exception?), or logical error?',
    parts: [
      { kind: 'choice', label: '(a) <code>int[] a = new int[3]; a[3] = 1;</code>', options: ERRORS, answer: 1 },
      { kind: 'choice', label: '(b) <code>String name = null; int n = name.length();</code>', options: ERRORS, answer: 2 },
      { kind: 'choice', label: '(c) <code>int x = 10 / 0;</code>', options: ERRORS, answer: 3 },
      { kind: 'choice', label: '(d) <code>int age = scanner.nextInt();</code> — the user types <code>abc</code>', options: ERRORS, answer: 4 },
      { kind: 'choice', label: '(e) <code>int count = "5";</code>', options: ERRORS, answer: 0 },
      { kind: 'choice', label: '(f) <code>double avg = sum / count;</code> with <code>int sum = 7, count = 2</code> gives <code>3.0</code>', options: ERRORS, answer: 5 }],
    note: '(e): a <code>String</code> is not an <code>int</code> → the compiler rejects it. (f): int division → it runs, but the result is wrong.' },
  { id: 'D.6', section: 'D', title: 'What is the output?',
    code: `String s = "java";
s.toUpperCase();
System.out.println(s);
s = s.toUpperCase();
System.out.println(s + 1 + 2);
System.out.println(1 + 2 + s);

int[] a = {1, 2, 3};
int[] b = a;
b[0] = 99;
System.out.println(a[0]);

try {
    System.out.println("A");
    int x = 10 / 0;
    System.out.println("B");
} catch (ArithmeticException e) {
    System.out.println("C");
} finally {
    System.out.println("D");
}`,
    parts: [{ kind: 'lines', label: 'Output (one line per <code>println</code>)', answer: ['java', 'JAVA12', '3JAVA', '99', 'A', 'C', 'D'] }],
    note: 'Strings are immutable (line 2 changes nothing); <code>+</code> works left to right; <code>b</code> is an alias of <code>a</code>; <code>B</code> is skipped, <code>finally</code> always runs.' },

  // ------------------------------------------------------------------ E
  { id: 'E.1', section: 'E', title: 'From model (UML) … to code',
    body: 'Implement the class <code>Rectangle</code>.<ul><li><code>getArea()</code> returns width × height.</li><li><code>getPerimeter()</code> returns 2 × (width + height).</li><li><code>toString()</code> returns, e.g., <code>"Rectangle 3.0 x 4.5"</code>.</li></ul>',
    uml: { classes: [{ name: 'Rectangle', role: 'todo', tag: 'Implement', attrs: ['- width: double', '- height: double'],
      methods: ['+ Rectangle(width: double, height: double)', '+ getArea(): double', '+ getPerimeter(): double', '+ toString(): String'] }] },
    code: `Rectangle r = new Rectangle(3.0, 4.5);
System.out.println(r.getArea());       // 13.5
System.out.println(r.getPerimeter());  // 15.0
System.out.println(r);                 // Rectangle 3.0 x 4.5`,
    parts: [{ kind: 'code', starter: 'public class Rectangle {\n    \n}',
      solution: `public class Rectangle {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    public double getArea() {
        return width * height;
    }
    public double getPerimeter() {
        return 2 * (width + height);      // 2 * width + height would be wrong
    }
    @Override
    public String toString() {
        return "Rectangle " + width + " x " + height;
    }
}`,
      test: `// Main.java -- in the same folder as Rectangle.java
public class Main {
    public static void main(String[] args) {
        Rectangle r = new Rectangle(3.0, 4.5);
        System.out.println(r.getArea() + "   (expected 13.5)");
        System.out.println(r.getPerimeter() + "   (expected 15.0)");
        System.out.println(r + "   (expected Rectangle 3.0 x 4.5)");
    }
}` }] },
  { id: 'E.2', section: 'E', title: 'Inheritance & discount',
    body: '(a) Implement <code>Product</code>: <code>calculateTotal(quantity)</code> returns price × quantity.<br>(b) Implement <code>BulkProduct</code>:<ul><li>Customer buys <strong>at least</strong> <code>minQuantity</code> items → <code>discountRate</code> off the total</li><li>Otherwise → normal total</li><li><code>getPrice()</code> still returns the normal price of one item</li><li>Reuse inherited functionality where appropriate</li></ul>',
    uml: { layout: 'extends', classes: [
      { name: 'Product', role: 'todo', tag: '(a) Implement', attrs: ['- name: String', '- price: double'],
        methods: ['+ Product(name: String, price: double)', '+ getName(): String', '+ getPrice(): double', '+ calculateTotal(quantity: int): double'] },
      { name: 'BulkProduct', role: 'todo', tag: '(b) Implement', attrs: ['- minQuantity: int', '- discountRate: double'],
        methods: ['+ BulkProduct(name: String, price: double, minQuantity: int, discountRate: double)', '+ calculateTotal(quantity: int): double'] }] },
    code: `BulkProduct p = new BulkProduct("Pens", 2.50, 10, 0.20);
System.out.println(p.getPrice());          // 2.5
System.out.println(p.calculateTotal(4));   // 10.0
System.out.println(p.calculateTotal(10));  // 20.0`,
    vars: {},
    parts: [
      { kind: 'expr', mode: 'example', label: 'Step 1 — by hand: 10 pens at $2.50, 20 % off (a Java expression with numbers)', expected: { type: 'double', v: 20.0 }, solution: '10 * 2.50 * (1 - 0.20)' },
      { kind: 'code', label: 'Step 2 — implement both classes.', starter: 'public class Product {\n    \n}\n\npublic class BulkProduct extends Product {\n    \n}',
        solution: `public class Product {
    private String name;
    private double price;
    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public double calculateTotal(int quantity) {
        return price * quantity;
    }
}

public class BulkProduct extends Product {
    private int minQuantity;
    private double discountRate;
    public BulkProduct(String name, double price,
                       int minQuantity, double discountRate) {
        super(name, price);         // the parent stores name and price
        this.minQuantity = minQuantity;
        this.discountRate = discountRate;
    }
    @Override
    public double calculateTotal(int quantity) {
        double total = super.calculateTotal(quantity);   // reuse: price * quantity
        if (quantity >= minQuantity) {                   // "at least" means >=
            total = total * (1 - discountRate);
        }
        return total;
    }
}`,
        test: `// Main.java -- in the same folder as Product.java and BulkProduct.java
public class Main {
    public static void main(String[] args) {
        BulkProduct p = new BulkProduct("Pens", 2.50, 10, 0.20);
        System.out.println(p.getPrice() + "   (expected 2.5)");
        System.out.println(p.calculateTotal(4) + "   (expected 10.0)");
        System.out.println(p.calculateTotal(10) + "   (expected 20.0)");
        System.out.println(p.calculateTotal(9) + "   (expected 22.5)");
    }
}` }],
    note: 'Each public class goes into its own file: <code>Product.java</code>, <code>BulkProduct.java</code>.' },
  { id: 'E.3', section: 'E', title: 'Aggregation: a class that has many objects',
    body: '<code>Song</code> is given. Implement <code>Playlist</code>:<ul><li>The constructor creates an <strong>empty</strong> list of songs.</li><li><code>getTotalSeconds()</code> returns the sum of all song lengths (in seconds).</li><li><code>getLongest()</code> returns the longest song — or <code>null</code> if the playlist is empty.</li><li><code>toString()</code> returns, e.g., <code>"Run: 3 songs, 8 min 5 s"</code>.</li></ul>',
    uml: { layout: 'aggregation', mult: '*', classes: [
      { name: 'Playlist', role: 'todo', tag: 'Implement', attrs: ['- name: String', '- songs: ArrayList<Song>'],
        methods: ['+ Playlist(name: String)', '+ addSong(song: Song)', '+ getTotalSeconds(): int', '+ getLongest(): Song', '+ toString(): String'] },
      { name: 'Song', role: 'given', attrs: ['- title: String', '- seconds: int'],
        methods: ['+ Song(title: String, seconds: int)', '+ getTitle(): String', '+ getSeconds(): int'] }] },
    code: `Playlist p = new Playlist("Run");
p.addSong(new Song("Intro", 95));
p.addSong(new Song("Speed", 210));
p.addSong(new Song("Cool down", 180));
System.out.println(p.getTotalSeconds());        // 485
System.out.println(p.getLongest().getTitle());  // Speed
System.out.println(p);                          // Run: 3 songs, 8 min 5 s`,
    vars: { total: ['int', 485] },
    tests: [{ total: 61 }, { total: 59 }],
    parts: [
      { kind: 'expr', mode: 'vars', label: 'Step 1 — the full minutes in <code>int total</code> (485 → 8)', ref: 'total / 60' },
      { kind: 'expr', mode: 'vars', label: 'Step 1 — the seconds left over (485 → 5)', ref: 'total % 60' },
      { kind: 'code', label: 'Step 2 — implement <code>Playlist</code>.', starter: 'import java.util.ArrayList;\n\npublic class Playlist {\n    \n}',
        solution: `import java.util.ArrayList;

public class Playlist {
    private String name;
    private ArrayList<Song> songs;
    public Playlist(String name) {
        this.name = name;
        songs = new ArrayList<>();         // empty list -- without it: NullPointerException
    }
    public void addSong(Song song) {
        songs.add(song);
    }
    public int getTotalSeconds() {
        int total = 0;
        for (Song song : songs) {
            total += song.getSeconds();
        }
        return total;
    }
    public Song getLongest() {
        Song longest = null;
        for (Song song : songs) {
            if (longest == null || song.getSeconds() > longest.getSeconds()) {
                longest = song;
            }
        }
        return longest;
    }
    @Override
    public String toString() {
        int total = getTotalSeconds();
        return name + ": " + songs.size() + " songs, "
               + total / 60 + " min " + total % 60 + " s";
    }
}`,
        given: `public class Song {
    private String title;
    private int seconds;
    public Song(String title, int seconds) {
        this.title = title;
        this.seconds = seconds;
    }
    public String getTitle() { return title; }
    public int getSeconds() { return seconds; }
}`,
        test: `// Main.java -- in the same folder as Song.java and Playlist.java
public class Main {
    public static void main(String[] args) {
        Playlist p = new Playlist("Run");
        System.out.println(p.getLongest() + "   (expected null)");
        p.addSong(new Song("Intro", 95));
        p.addSong(new Song("Speed", 210));
        p.addSong(new Song("Cool down", 180));
        System.out.println(p.getTotalSeconds() + "   (expected 485)");
        System.out.println(p.getLongest().getTitle() + "   (expected Speed)");
        System.out.println(p + "   (expected Run: 3 songs, 8 min 5 s)");
    }
}` }] },
  { id: 'E.4', section: 'E', title: 'static: one counter for all objects',
    body: 'Implement <code>Member</code>:<ul><li><code>memberCount</code> counts all <code>Member</code> objects ever created.</li><li>Every member gets the next number: the first member is <code>1</code>, the second <code>2</code>, …</li><li><code>toString()</code> returns, e.g., <code>"#2 Bo"</code>.</li><li><u>Underlined</u> in UML → <code>static</code></li></ul>',
    uml: { classes: [{ name: 'Member', role: 'todo', tag: 'Implement', attrs: ['_- memberCount: int', '- name: String', '- number: int'],
      methods: ['+ Member(name: String)', '+ getNumber(): int', '_+ getMemberCount(): int', '+ toString(): String'] }] },
    code: `Member m1 = new Member("Ana");
Member m2 = new Member("Bo");
System.out.println(m2);                      // #2 Bo
System.out.println(m1.getNumber());          // 1
System.out.println(Member.getMemberCount()); // 2`,
    parts: [{ kind: 'code', starter: 'public class Member {\n    \n}',
      solution: `public class Member {
    private static int memberCount = 0;    // ONE value for the whole class
    private String name;
    private int number;                    // one value per object
    public Member(String name) {
        this.name = name;
        memberCount++;
        number = memberCount;
    }
    public int getNumber() { return number; }
    public static int getMemberCount() { return memberCount; }
    @Override
    public String toString() { return "#" + number + " " + name; }
}`,
      test: `// Main.java -- in the same folder as Member.java
public class Main {
    public static void main(String[] args) {
        Member m1 = new Member("Ana");
        Member m2 = new Member("Bo");
        System.out.println(m2 + "   (expected #2 Bo)");
        System.out.println(m1.getNumber() + "   (expected 1)");
        System.out.println(Member.getMemberCount() + "   (expected 2)");
    }
}` }],
    note: 'If <code>memberCount</code> were not <code>static</code>, every member would have its own counter → every member would be #1.' },
  { id: 'E.5', section: 'E', title: 'From code … to model (UML)',
    code: `public class Account {
    private String owner;
    protected double balance;
    private static int count = 0;
    public Account(String owner, double balance) { ... count++; }
    public void deposit(double amount) { balance += amount; }
    public double getBalance() { return balance; }
    public static int getCount() { return count; }
}
public class SavingsAccount extends Account {
    private double interestRate;
    public SavingsAccount(String owner, double balance, double interestRate) { ... }
    public void addInterest() { balance += balance * interestRate; }
}`,
    parts: [
      { kind: 'paper', label: '(a) Draw the annotated UML class diagram for both classes (incl. the inheritance arrow) — on paper.',
        solutionUml: { layout: 'extends', classes: [
          { name: 'Account', attrs: ['- owner: String', '# balance: double', '_- count: int'],
            methods: ['+ Account(owner: String, balance: double)', '+ deposit(amount: double)', '+ getBalance(): double', '_+ getCount(): int'] },
          { name: 'SavingsAccount', attrs: ['- interestRate: double'],
            methods: ['+ SavingsAccount(owner: String, balance: double, interestRate: double)', '+ addInterest()'] }] },
        solutionNote: '<code>protected</code> is <code>#</code>; <code>static</code> is underlined; <code>void</code> methods show no return type; the subclass box shows only what is new.' },
      { kind: 'value', label: '(b) <code>SavingsAccount s = new SavingsAccount("Ana", 200.0, 0.05);</code><br>After calling <code>s.addInterest()</code> once, <code>s.getBalance()</code> returns', answer: 210.0 },
      { kind: 'value', label: '(b) … after a second call, it returns', answer: 220.5 }],
    note: 'Second call: <code>210.0 + 210.0 * 0.05 = 210.0 + 10.5</code>. The interest is computed on the <em>new</em> balance.' },

  // ------------------------------------------------------------------ F
  { id: 'F.1', section: 'F',
    code: `public static double average(int[] values) {
    int sum = 0;
    for (int v : values) { sum += v; }
    return sum / values.length;            // {3, 8, 1, 6} gives 4.0, not 4.5
}`,
    parts: [
      { kind: 'line', label: 'Corrected line', answers: ['return (double) sum / values.length;', 'return sum / (double) values.length;', 'return 1.0 * sum / values.length;', 'return (double) sum / (double) values.length;'], solution: 'return (double) sum / values.length;',
        wrong: [{ answer: 'return (double) (sum / values.length);', msg: 'The parentheses make the int division happen <em>first</em> → still <code>4.0</code>. Cast <code>sum</code> itself.' }] },
      { kind: 'free', label: 'Explanation', solution: 'int / int drops the decimals before the result becomes a double.' }] },
  { id: 'F.2', section: 'F',
    code: `// should return the price the customer PAYS after the discount
public double discountedPrice(double price, double rate) {
    return price * rate;                   // 40.0 and 0.25 give 10.0, not 30.0
}`,
    parts: [
      { kind: 'line', label: 'Corrected line', answers: ['return price * (1 - rate);', 'return price - price * rate;', 'return price * (1.0 - rate);'], solution: 'return price * (1 - rate);',
        wrong: [{ answer: 'return price * 1 - rate;', msg: '<code>*</code> comes before <code>-</code> → this is <code>price - rate</code>. Use parentheses.' }] },
      { kind: 'free', label: 'Explanation', solution: '<code>price * rate</code> is the amount saved, not the amount paid.' }] },
  { id: 'F.3', section: 'F',
    code: `public static double percentCorrect(int correct, int total) {
    return correct / total * 100;          // 18 and 24 give 0.0, not 75.0
}`,
    parts: [
      { kind: 'line', label: 'Corrected line', answers: ['return correct * 100.0 / total;', 'return 100.0 * correct / total;', 'return (double) correct / total * 100;', 'return correct / (double) total * 100;', 'return (double) correct * 100 / total;'], solution: 'return correct * 100.0 / total;',
        wrong: [{ answer: 'return (double) (correct / total) * 100;', msg: '<code>correct / total</code> is still int division (= 0) → <code>0.0</code>.' },
                { answer: 'return correct * 100 / total;', msg: 'Close: this gives <code>75.0</code> here, but <code>1</code> and <code>3</code> give <code>33.0</code> instead of <code>33.33…</code>. Use <code>100.0</code>.' }] },
      { kind: 'free', label: 'Explanation', solution: '<code>18 / 24</code> is <code>0</code> in int division, and <code>0 * 100</code> is <code>0</code>.' }] },
  { id: 'F.4', section: 'F',
    code: `public static int[] rowTotals(int[][] grid) {
    int[] totals = new int[grid.length];
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid.length; j++) {       // 3 rows x 4 columns: misses a column
            totals[i] += grid[i][j];
        }
    }
    return totals;
}`,
    parts: [
      { kind: 'line', label: 'Corrected line', answers: ['for (int j = 0; j < grid[i].length; j++) {', 'for (int j = 0; j < grid[0].length; j++) {'], solution: 'for (int j = 0; j < grid[i].length; j++) {' },
      { kind: 'free', label: 'Explanation', solution: '<code>grid.length</code> counts rows; the inner loop must run over the columns of row <code>i</code>.' }],
    note: '<code>grid[0].length</code> works only if all rows have the same length — <code>grid[i].length</code> always works.' },
  { id: 'F.5', section: 'F',
    code: `public class StudentTicket extends Ticket {
    // ... attribute and constructor: see the cheat sheet ...
    @Override
    public double calculatePrice() {
        return calculatePrice() * (1 - discountRate);   // StackOverflowError
    }
}`,
    parts: [
      { kind: 'line', label: 'Corrected line', answers: ['return super.calculatePrice() * (1 - discountRate);'], solution: 'return super.calculatePrice() * (1 - discountRate);' },
      { kind: 'free', label: 'Explanation', solution: 'Without <code>super.</code> the method calls itself forever.' }] },
  { id: 'F.6', section: 'F',
    code: `String answer = scanner.next();
if (answer == "yes") {                  // typing yes never prints "Great!"
    System.out.println("Great!");
}`,
    parts: [
      { kind: 'line', label: 'Corrected line', answers: ['if (answer.equals("yes")) {', 'if ("yes".equals(answer)) {'], solution: 'if (answer.equals("yes")) {' },
      { kind: 'free', label: 'Explanation', solution: '<code>==</code> compares references; <code>equals</code> compares the text.' }] },
  { id: 'F.7', section: 'F',
    code: `System.out.print("Age: ");
int age = scanner.nextInt();
System.out.print("Name: ");
String name = scanner.nextLine();       // name is always ""`,
    parts: [
      { kind: 'line', label: 'Missing line', answers: ['scanner.nextLine();'], solution: 'scanner.nextLine();' },
      { kind: 'choice', label: 'Where does it go?', options: ['before <code>int age = scanner.nextInt();</code>', 'right after <code>int age = scanner.nextInt();</code>', 'after <code>String name = scanner.nextLine();</code>'], answer: 1 },
      { kind: 'free', label: 'Explanation', solution: '<code>nextInt()</code> leaves the line break in the input; <code>nextLine()</code> reads it.' }] },
  { id: 'F.8', section: 'F',
    code: `int sum = 0;
for (int i = 0; i <= values.length; i++) {   // crashes
    sum += values[i];
}`,
    parts: [
      { kind: 'line', label: 'Corrected line', answers: ['for (int i = 0; i < values.length; i++) {', 'for (int i = 0; i <= values.length - 1; i++) {'], solution: 'for (int i = 0; i < values.length; i++) {' },
      { kind: 'free', label: 'Explanation', solution: 'The last valid index is <code>length - 1</code> → <code>ArrayIndexOutOfBoundsException</code>.' }] },
];
