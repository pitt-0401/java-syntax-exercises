// All practice exercises, one object per exercise.
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
//   free      a short explanation       -> the student compares with the sample solution
// UML members starting with "_" are static (underlined).

window.SECTIONS = [
  { id: 'A', title: 'Statements and headers', time: '10 min',
    task: 'Write <em>one</em> line of Java for each item: a statement, an expression, or a header.' },
  { id: 'B', title: 'Problem statement → Java expression', time: '15 min',
    task: 'Write one Java expression for each item, using the declared variables instead of hard-coded numbers. Your expression must evaluate to the correct result for any value.' },
  { id: 'C', title: 'Arrays, loops & input', time: '80 min',
    task: 'Implement each method with the given header. Most of them follow the same pattern:',
    code: `public static RESULT_TYPE name(int[] values) {
    RESULT_TYPE result = START;            // e.g., 0 for a sum, new int[...] for an array
    for (int i = 0; i < values.length; i++) {
        // look at values[i], update result
    }
    return result;
}` },
  { id: 'D', title: 'Tracing', time: '30 min',
    task: 'Work through each piece of code by hand, step by step, without running it. Write down what changes after each step.' },
  { id: 'E', title: 'Classes and objects', time: '75 min',
    task: 'Implement each class from its diagram or description. For a diagram, implement the <strong>highlighted</strong> parts: first translate the diagram line by line, then add the logic.' },
  { id: 'F', title: 'Debugging', time: '15 min',
    task: 'Each code snippet compiles but does not work as intended (wrong result or crash). For each: (1) write the corrected line of code, (2) briefly explain why the original line is incorrect.' },
];

const BIGO = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'];
const ERRORS = ['compile-time error', 'runtime: ArrayIndexOutOfBoundsException', 'runtime: NullPointerException',
  'runtime: ArithmeticException', 'runtime: InputMismatchException', 'logical error (wrong result, no crash)'];

window.EXERCISES = [
  // ------------------------------------------------------------------ A
  { id: 'A.1', section: 'A', body: 'Calculate the average of <code>int sum</code> and <code>int count</code> as a <code>double</code>, e.g., 7 and 2 → <code>3.5</code>.',
    parts: [{ kind: 'line', answers: ['(double) sum / count', 'sum / (double) count', '(double) sum / (double) count', '((double) sum) / count', '1.0 * sum / count', '(1.0 * sum) / count', 'sum * 1.0 / count', '(sum * 1.0) / count', 'double average = (double) sum / count;'], solution: '(double) sum / count',
      wrong: [{ answer: 'sum / count', msg: 'Both are <code>int</code>s → int division: <code>7 / 2</code> is <code>3</code>.' },
              { answer: '(double) (sum / count)', msg: 'The parentheses divide first (int division → <code>3</code>), then cast → <code>3.0</code>. Cast <code>sum</code> <em>before</em> dividing.' },
              { answer: 'sum / count * 1.0', msg: '<code>sum / count</code> runs first (int division → <code>3</code>) → <code>3.0</code>. Multiply by <code>1.0</code> before dividing.' }] }] },
  { id: 'A.2', section: 'A', body: 'Print <code>String name</code>, <code>int count</code>, and <code>double total</code> in the form <code>Ana bought 3 items for $7.50</code>, followed by a new line.',
    parts: [{ kind: 'line', answers: ['System.out.printf("%s bought %d items for $%.2f%n", name, count, total);', 'System.out.printf("%s bought %d items for $%.2f\\n", name, count, total);'], solution: 'System.out.printf("%s bought %d items for $%.2f%n", name, count, total);',
      wrong: [{ answer: 'System.out.printf("%s bought %d items for $%d%n", name, count, total);', msg: '<code>%d</code> is only for whole numbers → a <code>double</code> crashes (<code>IllegalFormatConversionException</code>). Use <code>%.2f</code>.' },
              { answer: 'System.out.printf("%s bought %d items for $%.2f%n", name, total, count);', msg: 'The values fill the placeholders in order → <code>%d</code> gets the <code>double</code> → crash.' },
              { answer: 'System.out.println(name + " bought " + count + " items for $" + total);', msg: 'This prints <code>$7.5</code>: <code>println</code> cannot force 2 decimals. Use <code>printf</code> with <code>%.2f</code>.' }] }] },
  { id: 'A.3', section: 'A', body: 'Check whether <code>word</code> is <code>"quit"</code>, ignoring upper/lower case, e.g., <code>"QUIT"</code> or <code>"Quit"</code>.',
    parts: [{ kind: 'line', answers: ['word.equalsIgnoreCase("quit")', '"quit".equalsIgnoreCase(word)', 'word.equalsIgnoreCase("QUIT")', 'word.toUpperCase().equals("QUIT")', '"QUIT".equals(word.toUpperCase())', 'word.toLowerCase().equals("quit")'], solution: 'word.equalsIgnoreCase("quit")',
      wrong: [{ answer: 'word.equals("quit")', msg: '<code>equals</code> is case-sensitive → <code>"QUIT"</code> gives <code>false</code>.' },
              { answer: 'word == "quit"', msg: '<code>==</code> compares <em>references</em> (same object?), not the text. It is also case-sensitive.' },
              { answer: 'word.toUpperCase() == "QUIT"', msg: '<code>==</code> compares references, not the text → use <code>equals</code>.' },
              { answer: 'word.toUpperCase().equals("quit")', msg: 'An uppercase word never equals lowercase <code>"quit"</code> → always <code>false</code>.' }] }] },
  { id: 'A.4', section: 'A', body: 'Convert <code>name</code> to uppercase and store the result in <code>name</code>, e.g., <code>"ana"</code> → <code>"ANA"</code>.',
    parts: [{ kind: 'line', answers: ['name = name.toUpperCase();'], solution: 'name = name.toUpperCase();',
      wrong: [{ answer: 'name.toUpperCase();', msg: 'Strings never change: <code>toUpperCase()</code> <em>returns</em> a new String, and this line throws it away → <code>name</code> is still <code>"ana"</code>.' },
              { answer: 'String name = name.toUpperCase();', msg: '<code>name</code> already exists → declaring it again is a compile error. Just assign: <code>name = ...</code>' }] }] },
  { id: 'A.5', section: 'A', body: 'Write the missing line between <code>int age = scanner.nextInt();</code> and <code>String name = scanner.nextLine();</code> so that <code>name</code> gets the full name, e.g., <code>Ana Lopez</code>.',
    parts: [{ kind: 'line', answers: ['scanner.nextLine();'], solution: 'scanner.nextLine();',
      wrong: [{ answer: 'String name = scanner.nextLine();', msg: 'That is the line <em>after</em> it. Without an extra <code>nextLine()</code> first, it reads the leftover Enter → <code>name</code> is <code>""</code>.' },
              { answer: 'scanner.next();', msg: '<code>next()</code> skips the Enter but also eats the first word → <code>name</code> is <code>" Lopez"</code> instead of <code>"Ana Lopez"</code>.' }] }],
    note: '<code>nextInt()</code> reads only the number and leaves the Enter (newline) behind. The extra <code>nextLine()</code> reads it and throws it away.' },
  { id: 'A.6', section: 'A', body: 'Write the header of a <code>while</code> loop that runs as long as the next input is <strong>not</strong> an <code>int</code>.',
    parts: [{ kind: 'line', answers: ['while (!scanner.hasNextInt()) {', 'while (!(scanner.hasNextInt())) {', 'while (scanner.hasNextInt() == false) {'], solution: 'while (!scanner.hasNextInt()) {',
      wrong: [{ answer: 'while (!scanner.nextInt()) {', msg: '<code>nextInt()</code> <em>reads</em> an <code>int</code> (not a <code>boolean</code>) → compile error. <code>hasNextInt()</code> only <em>checks</em>.' },
              { answer: 'while (scanner.hasNextInt()) {', msg: 'That is the opposite: it runs while the input <em>is</em> an <code>int</code>. Add <code>!</code>.' }] }],
    note: 'Inside the loop: <code>scanner.next();</code> to throw away the bad input; otherwise the loop never ends.' },
  { id: 'A.7', section: 'A', body: 'Write the Java header for the <strong>highlighted</strong> UML method.',
    uml: { classes: [{ name: 'Gradebook', attrs: ['- scores: int[]'], methods: ['+ addScore(score: int)', '_+ average(values: int[]): double'], hl: { methods: [1] } }] },
    parts: [{ kind: 'line', answers: ['public static double average(int[] values)'], solution: 'public static double average(int[] values)',
      wrong: [{ answer: 'public double average(int[] values)', msg: 'The method is <u>underlined</u> → it is <code>static</code>.' },
              { answer: 'public static double average(values: int[])', msg: 'UML writes <code>name: type</code>, Java writes <code>type name</code> → <code>int[] values</code>.' }] }] },
  { id: 'A.8', section: 'A', body: 'Write the Java header for the <strong>highlighted</strong> UML method.',
    uml: { classes: [{ name: 'Seating', attrs: ['- seats: char[][]'], methods: ['+ Seating(rows: int, cols: int)', '+ getRow(row: int): char[]'], hl: { methods: [1] } }] },
    parts: [{ kind: 'line', answers: ['public char[] getRow(int row)'], solution: 'public char[] getRow(int row)',
      wrong: [{ answer: 'public char getRow(int row)', msg: 'The return type is <code>char[]</code>: a whole row (an array), not one <code>char</code>.' },
              { answer: 'public char[][] getRow(int row)', msg: 'One row of a 2D array is a 1D array → <code>char[]</code>.' }] }] },
  { id: 'A.9', section: 'A', body: 'Write the Java header for the <strong>highlighted</strong> UML method.',
    uml: { classes: [{ name: 'Team', attrs: ['- players: ArrayList<Player>'], methods: ['+ addPlayer(player: Player)', '+ getSize(): int'], hl: { methods: [0] } }] },
    parts: [{ kind: 'line', answers: ['public void addPlayer(Player player)'], solution: 'public void addPlayer(Player player)',
      wrong: [{ answer: 'public addPlayer(Player player)', msg: 'No return type in UML → <code>void</code>. Without a return type, Java expects a constructor → compile error.' },
              { answer: 'public void addPlayer(ArrayList<Player> player)', msg: 'The parameter is <em>one</em> <code>Player</code> (<code>player: Player</code>), not the whole list.' }] }] },
  { id: 'A.10', section: 'A', body: 'In the constructor <code>Book(String title)</code>, assign the parameter <code>title</code> to the attribute <code>title</code>.',
    parts: [{ kind: 'line', answers: ['this.title = title;'], solution: 'this.title = title;',
      wrong: [{ answer: 'title = title;', msg: 'Inside the constructor, <code>title</code> means the <em>parameter</em> → it is assigned to itself and the attribute stays <code>null</code>. Use <code>this.title</code>.' },
              { answer: 'title = this.title;', msg: 'Backwards: this copies the attribute (<code>null</code>) into the parameter.' }] }] },
  { id: 'A.11', section: 'A', body: 'Write the first line of the constructor <code>Car(String brand, int seats)</code>. <code>Car</code> extends <code>Vehicle</code>, whose only constructor is <code>Vehicle(String brand)</code>.',
    parts: [{ kind: 'line', answers: ['super(brand);'], solution: 'super(brand);',
      wrong: [{ answer: 'super(brand, seats);', msg: '<code>Vehicle</code> has no constructor with 2 parameters → compile error. <code>seats</code> belongs to <code>Car</code>: <code>this.seats = seats;</code> comes next.' },
              { answer: 'Vehicle(brand);', msg: 'Call the superclass constructor with <code>super(...)</code>, not with its name → compile error.' },
              { answer: 'this.brand = brand;', msg: 'Without a <code>super(...)</code> line, Java first calls <code>super()</code> on its own, and <code>Vehicle</code> has no constructor without parameters → compile error. Pass <code>brand</code> to the <code>Vehicle</code> constructor: <code>super(brand);</code>' }] }],
    note: '<code>super(...)</code> must be the <strong>first</strong> line of the constructor.' },
  { id: 'A.12', section: 'A', body: '<code>Car</code> extends <code>Vehicle</code>, whose <code>toString()</code> returns, e.g., <code>"Toyota"</code>. Write the <code>return</code> statement of <code>Car</code>’s <code>toString()</code> so that it returns, e.g., <code>"Toyota, seats: 4"</code>.',
    parts: [{ kind: 'line', answers: ['return super.toString() + ", seats: " + seats;', 'return super.toString() + ", seats: " + this.seats;', 'return super.toString() + ", seats: " + getSeats();'], solution: 'return super.toString() + ", seats: " + seats;',
      wrong: [{ answer: 'return toString() + ", seats: " + seats;', msg: 'This calls <code>Car</code>’s own <code>toString()</code> again and again → <code>StackOverflowError</code>. Use <code>super.toString()</code>.' },
              { answer: 'return this.toString() + ", seats: " + seats;', msg: '<code>this.toString()</code> is <code>Car</code>’s own method → it calls itself forever → <code>StackOverflowError</code>.' },
              { answer: 'return Vehicle.toString() + ", seats: " + seats;', msg: '<code>ClassName.method()</code> is only for <code>static</code> methods → compile error. Use <code>super.toString()</code>.' }] }] },
  { id: 'A.13', section: 'A', body: 'Write the header of a <code>for</code> loop that goes through <code>int[] values</code> from the <strong>last</strong> index to the <strong>first</strong>.',
    parts: [{ kind: 'line', answers: ['for (int i = values.length - 1; i >= 0; i--) {', 'for (int i = values.length - 1; i > -1; i--) {', 'for (int i = values.length - 1; i >= 0; i = i - 1) {', 'for (int i = values.length - 1; i >= 0; i -= 1) {'], solution: 'for (int i = values.length - 1; i >= 0; i--) {',
      wrong: [{ answer: 'for (int i = values.length; i >= 0; i--) {', msg: 'The last index is <code>length - 1</code> → <code>values[i]</code> crashes right away (<code>ArrayIndexOutOfBoundsException</code>).' },
              { answer: 'for (int i = values.length - 1; i > 0; i--) {', msg: '<code>i > 0</code> stops before index 0 → the first element is skipped. Use <code>i >= 0</code>.' },
              { answer: 'for (int i = values.length - 1; i >= 0; i++) {', msg: '<code>i++</code> counts <em>up</em> → <code>ArrayIndexOutOfBoundsException</code>. Use <code>i--</code>.' }] }] },
  { id: 'A.14', section: 'A', body: 'Access the <strong>middle</strong> element of <code>int[] values</code> (odd length), e.g., <code>{4, 8, 15, 16, 23}</code> → <code>15</code>.',
    parts: [{ kind: 'line', answers: ['values[values.length / 2]', 'values[(values.length - 1) / 2]'], solution: 'values[values.length / 2]',
      wrong: [{ answer: 'values.length / 2', msg: 'That is the <em>index</em> of the middle (<code>2</code>), not the element → <code>values[...]</code>.' },
              { answer: 'values[2]', msg: 'Works only for length 5. Compute the index from <code>values.length</code>.' },
              { answer: 'values[values.length / 2.0]', msg: 'An index must be an <code>int</code> → compile error. <code>5 / 2</code> is already <code>2</code> (int division).' }] }],
    note: 'Int division helps here: <code>5 / 2</code> is <code>2</code>, exactly the middle index.' },
  { id: 'A.15', section: 'A', body: 'Access the <strong>last</strong> element in row <code>row</code> of <code>int[][] grid</code>. Rows can have different lengths.',
    parts: [{ kind: 'line', answers: ['grid[row][grid[row].length - 1]'], solution: 'grid[row][grid[row].length - 1]',
      wrong: [{ answer: 'grid[row][grid.length - 1]', msg: '<code>grid.length</code> is the number of <em>rows</em>. The length of row <code>row</code> is <code>grid[row].length</code>.' },
              { answer: 'grid[row][grid[row].length]', msg: 'The last index is <code>length - 1</code> → <code>ArrayIndexOutOfBoundsException</code>.' },
              { answer: 'grid[row][grid[0].length - 1]', msg: 'That uses the length of row 0, but rows can have different lengths. Use <code>grid[row].length</code>.' }] }] },
  { id: 'A.16', section: 'A', body: 'Given <code>ArrayList&lt;String&gt; names</code>, create an <code>int</code> array <code>scores</code> with one element per name.',
    parts: [{ kind: 'line', answers: ['int[] scores = new int[names.size()];'], solution: 'int[] scores = new int[names.size()];',
      wrong: [{ answer: 'int[] scores = new int[names.length];', msg: '<code>.length</code> is for arrays. An <code>ArrayList</code> has <code>.size()</code> → compile error.' },
              { answer: 'int[] scores = new int[names.length()];', msg: '<code>length()</code> is for Strings. An <code>ArrayList</code> has <code>size()</code> → compile error.' }] }] },
  { id: 'A.17', section: 'A', body: 'Copy <code>int[] values</code> into a new array <code>copy</code>, so that changes to <code>copy</code> do <strong>not</strong> affect <code>values</code>.',
    parts: [{ kind: 'line', answers: ['int[] copy = Arrays.copyOf(values, values.length);', 'int[] copy = values.clone();'], solution: 'int[] copy = Arrays.copyOf(values, values.length);',
      wrong: [{ answer: 'int[] copy = values;', msg: 'This copies only the <em>reference</em> → both names point to the same array, and <code>copy[0] = 99;</code> changes <code>values</code> too.' },
              { answer: 'int[] copy = Arrays.copyOf(values);', msg: '<code>copyOf</code> also needs the new length → compile error: <code>Arrays.copyOf(values, values.length)</code>.' }] }],
    note: 'Needs <code>import java.util.Arrays;</code>.' },
  { id: 'A.18', section: 'A', body: 'Remove the <strong>value</strong> 2 from <code>ArrayList&lt;Integer&gt; ids</code> = <code>[2, 30, 5]</code>, so that <code>ids</code> is <code>[30, 5]</code>.',
    parts: [{ kind: 'line', answers: ['ids.remove(Integer.valueOf(2));', 'ids.remove((Integer) 2);'], solution: 'ids.remove(Integer.valueOf(2));',
      wrong: [{ answer: 'ids.remove(2);', msg: 'With an <code>int</code>, <code>remove(2)</code> removes the element at <strong>index</strong> 2 (the <code>5</code>) → <code>[2, 30]</code>.' },
              { answer: 'ids.remove(0);', msg: 'That removes whatever is at index 0, which is right only by luck. Remove the <em>value</em>: <code>remove(Integer.valueOf(2))</code>.' }] }] },
  { id: 'A.19', section: 'A', body: 'A <code>Library</code> has many <code>Book</code>s. Declare the attribute <code>books</code> and initialize the empty list.',
    parts: [{ kind: 'line', answers: ['private ArrayList<Book> books = new ArrayList<>();', 'private ArrayList<Book> books = new ArrayList<Book>();'], solution: 'private ArrayList<Book> books = new ArrayList<>();',
      wrong: [{ answer: 'private ArrayList<Book> books;', msg: 'This only declares it → <code>books</code> is <code>null</code>, and the first <code>books.add(...)</code> throws a <code>NullPointerException</code>.' },
              { answer: 'public ArrayList<Book> books = new ArrayList<>();', msg: 'Attributes are <code>private</code> (encapsulation).' }] }] },
  { id: 'A.20', section: 'A', body: 'Write the <code>catch</code> header that handles text such as <code>abc</code> typed for <code>scanner.nextInt()</code>.',
    parts: [{ kind: 'line', answers: ['catch (InputMismatchException exception) {', '} catch (InputMismatchException exception) {', 'catch (InputMismatchException e) {', '} catch (InputMismatchException e) {', 'catch (InputMismatchException ex) {', '} catch (InputMismatchException ex) {', 'catch (java.util.InputMismatchException e) {', '} catch (java.util.InputMismatchException e) {'], solution: 'catch (InputMismatchException exception) {',
      wrong: [{ answer: 'catch (NumberFormatException exception) {', msg: '<code>nextInt()</code> throws an <code>InputMismatchException</code> → this <code>catch</code> does not catch it, and the program still crashes.' },
              { answer: 'catch (NumberFormatException e) {', msg: '<code>nextInt()</code> throws an <code>InputMismatchException</code> → this <code>catch</code> does not catch it, and the program still crashes.' },
              { answer: '} catch (NumberFormatException e) {', msg: '<code>nextInt()</code> throws an <code>InputMismatchException</code> → this <code>catch</code> does not catch it, and the program still crashes.' },
              { answer: 'catch (InputMismatchException) {', msg: 'A <code>catch</code> needs a variable name, e.g., <code>exception</code> → compile error.' }] }],
    note: 'Needs <code>import java.util.InputMismatchException;</code> (or <code>import java.util.*;</code>).' },
  { id: 'A.21', section: 'A', body: 'Check whether <code>String name</code> has at least one character. If <code>name</code> is <code>null</code>, the result is <code>false</code> (no crash).',
    parts: [{ kind: 'line', answers: ['name != null && name.length() > 0', 'name != null && name.length() >= 1', 'name != null && name.length() != 0', 'name != null && !name.equals("")', 'name != null && !"".equals(name)', 'name != null && !name.isEmpty()'], solution: 'name != null && name.length() > 0',
      wrong: [{ answer: 'name.length() > 0 && name != null', msg: 'Order matters: if <code>name</code> is <code>null</code>, <code>name.length()</code> runs first → <code>NullPointerException</code>. Check <code>null</code> first.' },
              { answer: 'name != null || name.length() > 0', msg: 'With <code>||</code>, a <code>null</code> name still runs <code>name.length()</code> → <code>NullPointerException</code>. And <code>""</code> gives <code>true</code>. Use <code>&&</code>.' },
              { answer: 'name.length() > 0', msg: 'If <code>name</code> is <code>null</code> → <code>NullPointerException</code>. Check <code>name != null &&</code> first.' }] }],
    note: '<code>&&</code> stops at the first <code>false</code> → <code>name.length()</code> only runs when <code>name</code> is not <code>null</code>.' },
  { id: 'A.22', section: 'A', body: 'Check whether the user passed at least one command-line argument.',
    parts: [{ kind: 'line', answers: ['args.length > 0', 'args.length >= 1', 'args.length != 0'], solution: 'args.length > 0',
      wrong: [{ answer: 'args != null', msg: 'Always <code>true</code>: without arguments, <code>args</code> is an empty array (length 0), not <code>null</code>.' },
              { answer: 'args[0] != null', msg: 'Without arguments, <code>args[0]</code> does not exist → <code>ArrayIndexOutOfBoundsException</code>.' },
              { answer: 'args.length() > 0', msg: 'Arrays have <code>.length</code> without <code>()</code> → compile error.' },
              { answer: 'args.size() > 0', msg: '<code>size()</code> is for <code>ArrayList</code>s. Arrays have <code>.length</code> → compile error.' }] }],
    note: 'Without arguments, <code>args</code> is an empty array (length 0), not <code>null</code>.' },

  // ------------------------------------------------------------------ B
  { id: 'B.1', section: 'B', body: 'Calculate the price after a 20 % discount.',
    vars: { price: ['double', 50.0], rate: ['double', 0.20] },
    tests: [{ price: 80.0, rate: 0.25 }, { price: 19.99, rate: 0.1 }],
    ref: 'price * (1 - rate)',
    parts: [{ kind: 'expr', mode: 'vars' }],
    note: '<code>price * rate</code> is what you <em>save</em> (10.0), not what you pay (40.0). <code>price - price * rate</code> also works.' },
  { id: 'B.2', section: 'B', body: 'Declare an <code>int</code> variable <code>remainingMinutes</code> and store in it the minutes that are left over after the full hours in <code>totalMinutes</code>. For example, 135 minutes are 2 hours and 15 minutes → 15.',
    vars: { totalMinutes: ['int', 135] },
    tests: [{ totalMinutes: 60 }, { totalMinutes: 59 }, { totalMinutes: 200 }],
    ref: 'int remainingMinutes = totalMinutes % 60;',
    parts: [{ kind: 'expr', mode: 'statement', target: 'remainingMinutes', declare: 'int', label: 'A declaration with a value' }],
    note: '<code>%</code> gives the remainder of a division: <code>135 % 60</code> is <code>15</code>. <code>totalMinutes - totalMinutes / 60 * 60</code> also works (int division).' },
  { id: 'B.3', section: 'B', body: 'Check whether a student passes: a <code>score</code> of at least 60 <strong>and</strong> an <code>attendance</code> of at least 80 %.',
    vars: { score: ['int', 72], attendance: ['double', 0.85] },
    tests: [{ score: 59, attendance: 0.9 }, { score: 60, attendance: 0.8 }, { score: 90, attendance: 0.79 }],
    ref: 'score >= 60 && attendance >= 0.8',
    parts: [{ kind: 'expr', mode: 'vars' }],
    note: '“At least” → <code>&gt;=</code>. Both conditions must hold → <code>&amp;&amp;</code>. 80 % of 1.0 is <code>0.8</code>.' },
  { id: 'B.4', section: 'B', body: 'Children under 6 and seniors 65 and older ride for free. Check whether a person of <code>age</code> rides for free.',
    vars: { age: ['int', 70] },
    tests: [{ age: 5 }, { age: 6 }, { age: 64 }, { age: 65 }],
    ref: 'age < 6 || age >= 65',
    parts: [{ kind: 'expr', mode: 'vars' }],
    note: 'One of the two is enough → <code>||</code>. With <code>&amp;&amp;</code>, nobody rides for free (no one is under 6 <em>and</em> 65 or older).' },
  { id: 'B.5', section: 'B', body: 'A password must have at least 8 characters. Check whether <code>password</code> is long enough.',
    vars: { password: ['String', 'java2026'] },
    tests: [{ password: 'abc' }, { password: '1234567' }, { password: '12345678' }],
    ref: 'password.length() >= 8',
    parts: [{ kind: 'expr', mode: 'vars' }],
    note: 'Strings have <code>length()</code> (with parentheses); arrays have <code>.length</code>.' },
  { id: 'B.6', section: 'B', body: 'A username must not contain a space. Check whether <code>username</code> is valid.',
    vars: { username: ['String', 'ana_lopez'] },
    tests: [{ username: 'ana lopez' }, { username: 'bo' }, { username: ' bo' }],
    ref: '!username.contains(" ")',
    parts: [{ kind: 'expr', mode: 'vars' }],
    note: '<code>!</code> flips the result: <code>contains(" ")</code> is <code>true</code> when there <em>is</em> a space. <code>username.contains(" ") == false</code> also works.' },
  { id: 'B.7', section: 'B', body: 'Build the full name from <code>first</code> and <code>last</code>, with a space in between, e.g., <code>"Ana Lopez"</code>.',
    vars: { first: ['String', 'Ana'], last: ['String', 'Lopez'] },
    tests: [{ first: 'Bo', last: 'Li' }],
    ref: 'first + " " + last',
    parts: [{ kind: 'expr', mode: 'vars' }],
    note: '<code>first + last</code> gives <code>"AnaLopez"</code>: the space is its own String. <code>first.concat(" ").concat(last)</code> also works.' },
  { id: 'B.8', section: 'B', body: 'Get the most recent temperature: the <strong>last</strong> element of <code>double[] temps</code>.',
    vars: { temps: ['double[]', [12.5, 15.0, 9.5]] },
    tests: [{ temps: [3.0] }, { temps: [1.0, 2.0, 3.0, 4.0] }],
    ref: 'temps[temps.length - 1]',
    parts: [{ kind: 'expr', mode: 'vars', label: 'For any length' }],
    note: '<code>temps[2]</code> only works for exactly 3 elements. The last index is always <code>temps.length - 1</code>.' },
  { id: 'B.9', section: 'B', body: 'Check whether the <strong>first</strong> and the <strong>last</strong> element of <code>int[] values</code> are the same.',
    vars: { values: ['int[]', [4, 8, 4]] },
    tests: [{ values: [4, 8, 5] }, { values: [7] }, { values: [1, 2, 3, 1] }],
    ref: 'values[0] == values[values.length - 1]',
    parts: [{ kind: 'expr', mode: 'vars', label: 'For any length' }],
    note: 'For an <code>int</code> array, <code>==</code> compares the numbers. For Strings, you would need <code>equals</code>.' },
  { id: 'B.10', section: 'B', body: 'Inside a loop: add the price of item <code>i</code> to <code>total</code> (a <strong>statement</strong> that changes <code>total</code>).',
    vars: { total: ['double', 20.0], prices: ['double[]', [4.5, 2.0, 3.25]], i: ['int', 1] },
    tests: [{ total: 0.0, prices: [1.0, 2.0, 3.0], i: 2 }, { total: 10.0, prices: [5.5], i: 0 }],
    ref: 'total = total + prices[i];',
    parts: [{ kind: 'expr', mode: 'statement', target: 'total' }],
    note: '<code>total += prices[i];</code> also works. Just <code>total + prices[i]</code> computes the new total and then throws it away.' },

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
      test: `// Practice.java
public class Practice {
    // paste your sum method here

    public static void main(String[] args) {
        System.out.println(sum(new int[]{3, 8, 1, 6}) + "   (expected 18)");
        System.out.println(sum(new int[]{5}) + "   (expected 5)");
        System.out.println(sum(new int[]{}) + "   (expected 0)");
    }
}` }] },
  { id: 'C.2', section: 'C', title: 'average',
    body: 'Implement <code>public static double average(int[] values)</code>: return the average of all elements.<br><code>average(new int[]{3, 8, 1, 6})</code> returns <code>4.5</code>, <strong>not</strong> <code>4.0</code>. Assume the array is not empty.',
    parts: [{ kind: 'code', starter: 'public static double average(int[] values) {\n    \n}',
      solution: `public static double average(int[] values) {
    int sum = 0;
    for (int value : values) {
        sum += value;
    }
    return (double) sum / values.length;   // sum / values.length gives 4.0
}`,
      test: `// Practice.java
public class Practice {
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
      test: `// Practice.java
public class Practice {
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
      test: `// Practice.java
import java.util.Arrays;

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
    body: 'Implement <code>public static double[] sharePercent(int[] votes)</code>: each element is a number of votes. Return each element’s share of all votes (in percent).<br><code>sharePercent(new int[]{1, 3, 4})</code> returns <code>{12.5, 37.5, 50.0}</code>.<br><em>Idea: two loops: first the total, then the shares.</em>',
    parts: [{ kind: 'code', starter: 'public static double[] sharePercent(int[] votes) {\n    \n}',
      solution: `public static double[] sharePercent(int[] votes) {
    int total = 0;
    for (int vote : votes) {
        total += vote;
    }
    double[] shares = new double[votes.length];
    for (int i = 0; i < votes.length; i++) {
        shares[i] = votes[i] * 100.0 / total;   // part * 100.0 / whole
    }
    return shares;
}`,
      test: `// Practice.java
import java.util.Arrays;

public class Practice {
    // paste your sharePercent method here

    public static void main(String[] args) {
        System.out.println(Arrays.toString(sharePercent(new int[]{1, 3, 4})) + "   (expected [12.5, 37.5, 50.0])");
        System.out.println(Arrays.toString(sharePercent(new int[]{1, 1, 2})) + "   (expected [25.0, 25.0, 50.0])");
    }
}` }] },
  { id: 'C.6', section: 'C', title: 'max',
    body: 'Implement <code>public static int max(int[] values)</code>: return the largest element.<br><code>max(new int[]{4, 17, 9, 17, 2})</code> returns <code>17</code>. Assume the array is not empty. The numbers can be negative.',
    parts: [{ kind: 'code', starter: 'public static int max(int[] values) {\n    \n}',
      solution: `public static int max(int[] values) {
    int largest = values[0];               // not 0: all values could be negative
    for (int i = 1; i < values.length; i++) {
        if (values[i] > largest) {
            largest = values[i];
        }
    }
    return largest;
}`,
      test: `// Practice.java
public class Practice {
    // paste your max method here

    public static void main(String[] args) {
        System.out.println(max(new int[]{4, 17, 9, 17, 2}) + "   (expected 17)");
        System.out.println(max(new int[]{-5, -2, -8}) + "   (expected -2)");
        System.out.println(max(new int[]{7}) + "   (expected 7)");
    }
}` }],
    note: 'Starting with <code>largest = 0</code> gives <code>0</code> for <code>{-5, -2, -8}</code>. Start with the first element instead.' },
  { id: 'C.7', section: 'C', title: 'indexOf',
    body: 'Implement <code>public static int indexOf(int[] values, int target)</code>: return the index of the <strong>first</strong> element equal to <code>target</code>, or <code>-1</code> if there is none.<br>For <code>values = {4, 17, 9, 17, 2}</code>: <code>indexOf(values, 17)</code> returns <code>1</code>, and <code>indexOf(values, 5)</code> returns <code>-1</code>.',
    parts: [{ kind: 'code', starter: 'public static int indexOf(int[] values, int target) {\n    \n}',
      solution: `public static int indexOf(int[] values, int target) {
    for (int i = 0; i < values.length; i++) {
        if (values[i] == target) {
            return i;                      // found: stop right here
        }
    }
    return -1;                             // the loop ended: not found
}`,
      test: `// Practice.java
public class Practice {
    // paste your indexOf method here

    public static void main(String[] args) {
        int[] values = {4, 17, 9, 17, 2};
        System.out.println(indexOf(values, 17) + "   (expected 1)");
        System.out.println(indexOf(values, 4) + "   (expected 0)");
        System.out.println(indexOf(values, 5) + "   (expected -1)");
        System.out.println(indexOf(new int[]{}, 5) + "   (expected -1)");
    }
}` }],
    note: 'The <code>return -1;</code> goes <em>after</em> the loop. Inside the loop, in an <code>else</code>, it would stop at the first element that does not match.' },
  { id: 'C.8', section: 'C', title: 'countVowels (String)',
    body: 'Implement <code>public static int countVowels(String word)</code>: return how many letters of <code>word</code> are vowels (<code>a</code>, <code>e</code>, <code>i</code>, <code>o</code>, <code>u</code>). The word is all lowercase.<br><code>countVowels("banana")</code> returns <code>3</code>.',
    parts: [{ kind: 'code', starter: 'public static int countVowels(String word) {\n    \n}',
      solution: `public static int countVowels(String word) {
    int count = 0;
    for (int i = 0; i < word.length(); i++) {
        char letter = word.charAt(i);
        if (letter == 'a' || letter == 'e' || letter == 'i' || letter == 'o' || letter == 'u') {
            count++;
        }
    }
    return count;
}`,
      test: `// Practice.java
public class Practice {
    // paste your countVowels method here

    public static void main(String[] args) {
        System.out.println(countVowels("banana") + "   (expected 3)");
        System.out.println(countVowels("rhythm") + "   (expected 0)");
        System.out.println(countVowels("") + "   (expected 0)");
    }
}` }],
    note: 'A String works like an array of characters: <code>word.length()</code> (with parentheses) and <code>word.charAt(i)</code> instead of <code>values.length</code> and <code>values[i]</code>. A <code>char</code> is written in single quotes: <code>\'a\'</code>.' },
  { id: 'C.9', section: 'C', title: 'letterGrade (write the header)',
    body: 'Write a <code>public static</code> method <code>letterGrade</code> that takes a score (a whole number) and returns the letter grade as a <code>String</code>: <code>"A"</code> for 90 and above, <code>"B"</code> for 80–89, <code>"C"</code> for 70–79, <code>"D"</code> for 60–69, and <code>"F"</code> below 60.<br>This time, write the method header yourself.',
    parts: [{ kind: 'code', starter: '',
      solution: `public static String letterGrade(int score) {
    if (score >= 90) {
        return "A";
    } else if (score >= 80) {              // only reached if score < 90
        return "B";
    } else if (score >= 70) {
        return "C";
    } else if (score >= 60) {
        return "D";
    } else {
        return "F";
    }
}`,
      test: `// Practice.java
public class Practice {
    // paste your letterGrade method here

    public static void main(String[] args) {
        System.out.println(letterGrade(95) + "   (expected A)");
        System.out.println(letterGrade(80) + "   (expected B)");
        System.out.println(letterGrade(79) + "   (expected C)");
        System.out.println(letterGrade(60) + "   (expected D)");
        System.out.println(letterGrade(12) + "   (expected F)");
    }
}` }],
    note: 'Check from the top down. Each <code>else if</code> runs only when every condition above it was false, so <code>score >= 80</code> does not need <code>&amp;&amp; score &lt; 90</code>.' },
  { id: 'C.10', section: 'C', title: 'rowAverages (2D)',
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
      test: `// Practice.java
import java.util.Arrays;

public class Practice {
    // paste your rowAverages method here

    public static void main(String[] args) {
        int[][] scores = { {80, 90, 100}, {70, 75, 80, 85}, {60, 65} };
        System.out.println(Arrays.toString(rowAverages(scores)) + "   (expected [90.0, 77.5, 62.5])");
    }
}` }] },
  { id: 'C.11', section: 'C', title: 'columnTotals (2D)',
    body: 'Implement <code>public static int[] columnTotals(int[][] sales)</code>: return the total of each <strong>column</strong>. Assume that all rows have the same length.',
    code: `int[][] sales = { {10, 20, 30, 40}, {15, 25, 35, 45}, {5, 10, 15, 20} };
columnTotals(sales)   // returns {30, 55, 80, 105}`,
    parts: [
      { kind: 'value', label: '(a) How many elements does the returned array contain?', answer: 4 },
      { kind: 'line', label: '(b) Which expression gives you that number (for any <code>sales</code>)?', answers: ['sales[0].length'], solution: 'sales[0].length',
        wrong: [{ answer: 'sales.length', msg: '<code>sales.length</code> is the number of <strong>rows</strong> (3). You need the number of columns.' }] },
      { kind: 'code', label: '(c) Implement the method.', starter: 'public static int[] columnTotals(int[][] sales) {\n    \n}',
        solution: `public static int[] columnTotals(int[][] sales) {
    int[] totals = new int[sales[0].length];            // one per COLUMN
    for (int col = 0; col < sales[0].length; col++) {   // outer loop: columns
        for (int row = 0; row < sales.length; row++) {  // inner loop: rows
            totals[col] += sales[row][col];             // still [row][col]
        }
    }
    return totals;
}`,
        test: `// Practice.java
import java.util.Arrays;

public class Practice {
    // paste your columnTotals method here

    public static void main(String[] args) {
        int[][] sales = { {10, 20, 30, 40}, {15, 25, 35, 45}, {5, 10, 15, 20} };
        System.out.println(Arrays.toString(columnTotals(sales)) + "   (expected [30, 55, 80, 105])");
    }
}` }],
    note: 'The index order is always <code>[row][col]</code>, whichever loop is outside.' },
  { id: 'C.12', section: 'C', title: 'makeGrid (2D)',
    body: 'Implement <code>public static int[][] makeGrid(int rows, int cols)</code>: create a new 2D array with <code>rows</code> rows and <code>cols</code> columns and fill it with the numbers 0, 1, 2, … row by row.<br><code>makeGrid(2, 3)</code> returns <code>{{0, 1, 2}, {3, 4, 5}}</code>.',
    parts: [{ kind: 'code', starter: 'public static int[][] makeGrid(int rows, int cols) {\n    \n}',
      solution: `public static int[][] makeGrid(int rows, int cols) {
    int[][] grid = new int[rows][cols];
    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            grid[row][col] = row * cols + col;
        }
    }
    return grid;
}`,
      test: `// Practice.java
import java.util.Arrays;

public class Practice {
    // paste your makeGrid method here

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(makeGrid(2, 3)) + "   (expected [[0, 1, 2], [3, 4, 5]])");
        System.out.println(Arrays.deepToString(makeGrid(3, 1)) + "   (expected [[0], [1], [2]])");
    }
}` }],
    note: 'A counter works too: <code>int next = 0;</code> before the loops and <code>grid[row][col] = next; next++;</code> inside.' },
  { id: 'C.13', section: 'C', title: 'Input & arrays: main',
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
    body: 'Write down the array after each pass of the <strong>outer</strong> loop. Separate the numbers with spaces or commas.',
    parts: [{ kind: 'seqtable', start: '29 10 14 37 13', cols: ['SelectionSort', 'BubbleSort', 'InsertionSort'],
      rows: ['after pass 1', 'after pass 2', 'after pass 3'],
      answers: [['10 29 14 37 13', '10 14 29 13 37', '10 29 14 37 13'],
                ['10 13 14 37 29', '10 14 13 29 37', '10 14 29 37 13'],
                ['10 13 14 37 29', '10 13 14 29 37', '10 14 29 37 13']] }],
    note: 'SelectionSort pass 3: 14 is already the smallest of the rest → it swaps with itself. InsertionSort pass 3: 37 is already in place.' },
  { id: 'D.2', section: 'D', title: 'Binary search',
    body: '<code>int[] values = {3, 8, 15, 21, 34, 42, 57, 63, 78};</code> (indices 0–8).<br>Binary search compares the target with the middle element, <code>values[mid]</code>. If that is not the target, it keeps searching only the left or the right half. Trace each call by hand.',
    parts: [
      { kind: 'seq', label: '(a) <code>binarySearch(values, 57)</code>: list every <code>values[mid]</code> that is compared with 57, in order. Separate the numbers with spaces or commas.', answer: ['34', '57'] },
      { kind: 'value', label: '(a) What does <code>binarySearch(values, 57)</code> return?', answer: 6 },
      { kind: 'seq', label: '(b) <code>binarySearch(values, 10)</code>: list every <code>values[mid]</code> that is compared with 10, in order.', answer: ['34', '8', '15'] },
      { kind: 'value', label: '(b) What does <code>binarySearch(values, 10)</code> return?', answer: -1 },
      { kind: 'choice', label: '(c) Why does binary search not work on <code>{8, 3, 21}</code>?',
        options: ['The array is too short.', 'The array is not sorted.', 'The length is odd.', '21 is too large.'], answer: 1 }],
    note: '(a) mid = (0 + 8) / 2 = 4 → 34; 57 &gt; 34 → left = 5; mid = (5 + 8) / 2 = 6 → 57. (b) 34 → 8 → 15, then left &gt; right → -1.' },
  { id: 'D.3', section: 'D', title: 'Big-O',
    body: 'Give the worst-case Big-O for an array <code>values</code> with <em>n</em> elements.',
    parts: [
      { kind: 'choice', label: '(a) <code>int value = values[3];</code>', options: BIGO, answer: 0 },
      { kind: 'choice', label: '(b) <code>for (int i = 0; i &lt; values.length; i++) { sum += values[i]; }</code>', options: BIGO, answer: 2 },
      { kind: 'choice', label: '(c) <code>for (int i = 0; i &lt; values.length; i++) { for (int j = 0; j &lt; values.length; j++) { … } }</code>', options: BIGO, answer: 4 },
      { kind: 'choice', label: '(d) <code>for (int i = values.length; i &gt; 1; i = i / 2) { … }</code>', options: BIGO, answer: 1 },
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
      { kind: 'choice', label: '(a) <code>int[] numbers = new int[3]; numbers[3] = 1;</code>', options: ERRORS, answer: 1 },
      { kind: 'choice', label: '(b) <code>String name = null; int length = name.length();</code>', options: ERRORS, answer: 2 },
      { kind: 'choice', label: '(c) <code>int result = 10 / 0;</code>', options: ERRORS, answer: 3 },
      { kind: 'choice', label: '(d) <code>int age = scanner.nextInt();</code> and the user types <code>abc</code>', options: ERRORS, answer: 4 },
      { kind: 'choice', label: '(e) <code>int count = "5";</code>', options: ERRORS, answer: 0 },
      { kind: 'choice', label: '(f) <code>double avg = sum / count;</code> with <code>int sum = 7, count = 2</code> gives <code>3.0</code>', options: ERRORS, answer: 5 }],
    note: '(e): a <code>String</code> is not an <code>int</code> → the compiler rejects it. (f): int division → it runs, but the result is wrong.' },
  { id: 'D.6', section: 'D', title: 'What is the output?',
    code: `String word = "java";
word.toUpperCase();
System.out.println(word);
word = word.toUpperCase();
System.out.println(word + 1 + 2);
System.out.println(1 + 2 + word);

int[] numbers = {1, 2, 3};
int[] moreNumbers = numbers;
moreNumbers[0] = 99;
System.out.println(numbers[0]);

try {
    System.out.println("A");
    int result = 10 / 0;
    System.out.println("B");
} catch (ArithmeticException exception) {
    System.out.println("C");
} finally {
    System.out.println("D");
}`,
    parts: [{ kind: 'lines', label: 'Output (one line per <code>println</code>)', answer: ['java', 'JAVA12', '3JAVA', '99', 'A', 'C', 'D'] }],
    note: 'Strings are immutable (line 2 changes nothing); <code>+</code> works left to right; <code>moreNumbers</code> refers to the same array as <code>numbers</code>; <code>B</code> is skipped, <code>finally</code> always runs.' },

  // ------------------------------------------------------------------ E
  { id: 'E.1', section: 'E', title: 'From model (UML) … to code',
    body: 'Implement the class <code>Rectangle</code>.<ul><li><code>getArea()</code> returns width × height.</li><li><code>getPerimeter()</code> returns 2 × (width + height).</li><li><code>toString()</code> returns, e.g., <code>"Rectangle 3.0 x 4.5"</code>.</li></ul>',
    uml: { classes: [{ name: 'Rectangle', role: 'todo', tag: 'Implement', attrs: ['- width: double', '- height: double'],
      methods: ['+ Rectangle(width: double, height: double)', '+ getArea(): double', '+ getPerimeter(): double', '+ toString(): String'] }] },
    code: `Rectangle rectangle = new Rectangle(3.0, 4.5);
System.out.println(rectangle.getArea());       // 13.5
System.out.println(rectangle.getPerimeter());  // 15.0
System.out.println(rectangle);                 // Rectangle 3.0 x 4.5`,
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
        Rectangle rectangle = new Rectangle(3.0, 4.5);
        System.out.println(rectangle.getArea() + "   (expected 13.5)");
        System.out.println(rectangle.getPerimeter() + "   (expected 15.0)");
        System.out.println(rectangle + "   (expected Rectangle 3.0 x 4.5)");
    }
}` }] },
  { id: 'E.2', section: 'E', title: 'Inheritance & discount',
    body: '(a) Implement <code>Product</code>: <code>calculateTotal(quantity)</code> returns price × quantity.<br>(b) Implement <code>BulkProduct</code>:<ul><li>Customer buys <strong>at least</strong> <code>minQuantity</code> items → <code>discountRate</code> off the total</li><li>Otherwise → normal total</li><li><code>getPrice()</code> still returns the normal price of one item</li><li>Reuse inherited functionality where appropriate</li></ul>',
    uml: { layout: 'extends', classes: [
      { name: 'Product', role: 'todo', tag: '(a) Implement', attrs: ['- name: String', '- price: double'],
        methods: ['+ Product(name: String, price: double)', '+ getName(): String', '+ getPrice(): double', '+ calculateTotal(quantity: int): double'] },
      { name: 'BulkProduct', role: 'todo', tag: '(b) Implement', attrs: ['- minQuantity: int', '- discountRate: double'],
        methods: ['+ BulkProduct(name: String, price: double, minQuantity: int, discountRate: double)', '+ calculateTotal(quantity: int): double'] }] },
    code: `BulkProduct pens = new BulkProduct("Pens", 2.50, 10, 0.20);
System.out.println(pens.getPrice());          // 2.5
System.out.println(pens.calculateTotal(4));   // 10.0
System.out.println(pens.calculateTotal(10));  // 20.0`,
    vars: {},
    parts: [
      { kind: 'expr', mode: 'example', label: 'Step 1, by hand: 10 pens at $2.50, 20 % off (a Java expression with numbers)', expected: { type: 'double', v: 20.0 }, solution: '10 * 2.50 * (1 - 0.20)' },
      { kind: 'code', label: 'Step 2: implement both classes.', starter: 'public class Product {\n    \n}\n\npublic class BulkProduct extends Product {\n    \n}',
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
        BulkProduct pens = new BulkProduct("Pens", 2.50, 10, 0.20);
        System.out.println(pens.getPrice() + "   (expected 2.5)");
        System.out.println(pens.calculateTotal(4) + "   (expected 10.0)");
        System.out.println(pens.calculateTotal(10) + "   (expected 20.0)");
        System.out.println(pens.calculateTotal(9) + "   (expected 22.5)");
    }
}` }],
    note: 'Each public class goes into its own file: <code>Product.java</code>, <code>BulkProduct.java</code>.' },
  { id: 'E.3', section: 'E', title: 'Aggregation: a class that has many objects',
    body: '<code>Song</code> is given. Implement <code>Playlist</code>:<ul><li>The constructor creates an <strong>empty</strong> list of songs.</li><li><code>getTotalSeconds()</code> returns the sum of all song lengths (in seconds).</li><li><code>getLongest()</code> returns the longest song, or <code>null</code> if the playlist is empty.</li><li><code>toString()</code> returns, e.g., <code>"Run: 3 songs, 8 min 5 s"</code>.</li></ul>',
    uml: { layout: 'aggregation', mult: '*', classes: [
      { name: 'Playlist', role: 'todo', tag: 'Implement', attrs: ['- name: String', '- songs: ArrayList<Song>'],
        methods: ['+ Playlist(name: String)', '+ addSong(song: Song)', '+ getTotalSeconds(): int', '+ getLongest(): Song', '+ toString(): String'] },
      { name: 'Song', role: 'given', attrs: ['- title: String', '- seconds: int'],
        methods: ['+ Song(title: String, seconds: int)', '+ getTitle(): String', '+ getSeconds(): int'] }] },
    code: `Playlist playlist = new Playlist("Run");
playlist.addSong(new Song("Intro", 95));
playlist.addSong(new Song("Speed", 210));
playlist.addSong(new Song("Cool down", 180));
System.out.println(playlist.getTotalSeconds());        // 485
System.out.println(playlist.getLongest().getTitle());  // Speed
System.out.println(playlist);                          // Run: 3 songs, 8 min 5 s`,
    vars: { total: ['int', 485] },
    tests: [{ total: 61 }, { total: 59 }],
    parts: [
      { kind: 'expr', mode: 'vars', label: 'Step 1: the full minutes in <code>int total</code> (485 → 8)', ref: 'total / 60' },
      { kind: 'expr', mode: 'vars', label: 'Step 1: the seconds left over (485 → 5)', ref: 'total % 60' },
      { kind: 'code', label: 'Step 2: implement <code>Playlist</code>.', starter: 'import java.util.ArrayList;\n\npublic class Playlist {\n    \n}',
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
        Playlist playlist = new Playlist("Run");
        System.out.println(playlist.getLongest() + "   (expected null)");
        playlist.addSong(new Song("Intro", 95));
        playlist.addSong(new Song("Speed", 210));
        playlist.addSong(new Song("Cool down", 180));
        System.out.println(playlist.getTotalSeconds() + "   (expected 485)");
        System.out.println(playlist.getLongest().getTitle() + "   (expected Speed)");
        System.out.println(playlist + "   (expected Run: 3 songs, 8 min 5 s)");
    }
}` }] },
  { id: 'E.4', section: 'E', title: 'static: one counter for all objects',
    body: 'Implement <code>Member</code>:<ul><li><code>memberCount</code> counts all <code>Member</code> objects ever created.</li><li>Every member gets the next number: the first member is <code>1</code>, the second <code>2</code>, …</li><li><code>toString()</code> returns, e.g., <code>"#2 Bo"</code>.</li><li><u>Underlined</u> in UML → <code>static</code></li></ul>',
    uml: { classes: [{ name: 'Member', role: 'todo', tag: 'Implement', attrs: ['_- memberCount: int', '- name: String', '- number: int'],
      methods: ['+ Member(name: String)', '+ getNumber(): int', '_+ getMemberCount(): int', '+ toString(): String'] }] },
    code: `Member ana = new Member("Ana");
Member bo = new Member("Bo");
System.out.println(bo);                       // #2 Bo
System.out.println(ana.getNumber());          // 1
System.out.println(Member.getMemberCount());  // 2`,
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
        Member ana = new Member("Ana");
        Member bo = new Member("Bo");
        System.out.println(bo + "   (expected #2 Bo)");
        System.out.println(ana.getNumber() + "   (expected 1)");
        System.out.println(Member.getMemberCount() + "   (expected 2)");
    }
}` }],
    note: 'If <code>memberCount</code> were not <code>static</code>, every member would have its own counter → every member would be #1.' },
  { id: 'E.5', section: 'E', title: 'Inherited methods and static',
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
      { kind: 'value', label: '(a) <code>SavingsAccount account = new SavingsAccount("Ana", 200.0, 0.05);</code><br>After calling <code>account.addInterest()</code> once, <code>account.getBalance()</code> returns', answer: 210.0 },
      { kind: 'value', label: '(b) … after a second call, it returns', answer: 220.5 },
      { kind: 'value', label: '(c) Then <code>Account other = new Account("Ben", 50.0);</code> runs. Now <code>Account.getCount()</code> returns', answer: 2 }],
    note: 'Second call: <code>210.0 + 210.0 * 0.05 = 210.0 + 10.5</code>. The interest is computed on the <em>new</em> balance. <code>count</code> is <code>static</code>: one variable shared by all accounts. The <code>SavingsAccount</code> constructor calls the <code>Account</code> constructor (<code>super(...)</code>), so both objects count.' },

  { id: 'E.6', section: 'E', title: 'From a description: exceptions',
    body: 'Implement <code>BankAccount</code> from this description:<ul><li>Each account has an owner (a <code>String</code>) and a balance (a <code>double</code>). Both are private.</li><li>The constructor takes the owner. A new account has a balance of <code>0.0</code>.</li><li><code>getBalance()</code> returns the balance, and <code>deposit(amount)</code> adds to it.</li><li><code>withdraw(amount)</code> subtracts from the balance. If the amount is larger than the balance, it throws an <code>IllegalArgumentException</code> with the message <code>"Not enough money"</code> and does not change the balance.</li></ul>',
    parts: [
      { kind: 'code', label: '(a) The class <code>BankAccount</code>', starter: 'public class BankAccount {\n    \n}',
        solution: `public class BankAccount {
    private String owner;
    private double balance;

    public BankAccount(String owner) {
        this.owner = owner;
        balance = 0.0;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) {
            throw new IllegalArgumentException("Not enough money");
        }
        balance -= amount;                 // not reached after throw
    }
}`,
        testIntro: 'Copy this file, add your class, and run it. The first line should show the same value twice. Then the program should stop with the exception: that is the expected result here.',
        test: `// Main.java -- in the same folder as BankAccount.java
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("Ana");
        account.deposit(100.0);
        account.withdraw(30.0);
        System.out.println(account.getBalance() + "   (expected 70.0)");
        account.withdraw(500.0);           // expected: the program stops with
                                           // IllegalArgumentException: Not enough money
    }
}` },
      { kind: 'code', label: '(b) A <code>main</code> method: create an account for Ana, deposit 100.0, and try to withdraw 500.0. Catch the exception and print <code>Error: </code> followed by its message. Then print the balance.',
        starter: 'public static void main(String[] args) {\n    \n}',
        solution: `public static void main(String[] args) {
    BankAccount account = new BankAccount("Ana");
    account.deposit(100.0);
    try {
        account.withdraw(500.0);
        System.out.println("Withdrawn");   // skipped: withdraw threw
    } catch (IllegalArgumentException exception) {
        System.out.println("Error: " + exception.getMessage());
    }
    System.out.println(account.getBalance());
}`,
        testNote: 'Run it in VS Code. It should print <code>Error: Not enough money</code> and then <code>100.0</code>.' }],
    note: '<code>throw</code> ends the method right away, like <code>return</code>. The caller decides what happens next: without <code>try</code>/<code>catch</code>, the program stops.' },
  // ------------------------------------------------------------------ F
  { id: 'F.1', section: 'F',
    code: `public static double average(int[] values) {
    int sum = 0;
    for (int value : values) { sum += value; }
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
    note: '<code>grid[0].length</code> works only if all rows have the same length; <code>grid[i].length</code> always works.' },
  { id: 'F.5', section: 'F',
    code: `public class StudentTicket extends Ticket {
    // ... attribute and constructor omitted ...
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
