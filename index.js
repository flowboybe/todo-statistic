const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = findTodos();
const table = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function fillTableRow(todo) {
    let result = [];
    let splitted_todo = todo.split(';');
    if (splitted_todo.length <= 1)
        return;
    if (todo.indexOf('!') != -1)
        result.push('  !   ');
    else
        result.push('      ');
    result.push(`  ${(splitted_todo[0].split(' ')[2]).trim()}  `);
    result.push(`  ${(splitted_todo[1]).trim()}  `);
    result.push(`  ${(splitted_todo[2]).trim()}`);
    table.push(result);
}

function getMaxRowLengths(){
    let maxRowLengths = [0, 0, 0, 0];
    for (let row = 0; row < table.length; row++)
        for (let col = 0; col < 4; col++){
            if (table[row][col].length > maxRowLengths[col])
                maxRowLengths[col] = table[row][col].length;
        }
    return maxRowLengths;
}

function padToMaxRowLengths(maxRowLengths) {
    for (let row = 0; row < table.length; row++)
        for (let col = 0; col < 4; col++){
            table[row][col] = table[row][col].padEnd(maxRowLengths[col], ' ') + '|';
        }
}

function renderTable() {
    let maxRowLengths = getMaxRowLengths();
    padToMaxRowLengths(maxRowLengths);
    for (let row of table) {
        let result = '';
        for (let col of row)
            result += col;
        console.log(result);
    }
}

function findTodos(){
    arr = [];
    for(const file of files){
        let pos = 0;
        const target = '// ' + 'TODO'
        while (true) {
            let foundPos = file.indexOf(target, pos);

            if (foundPos == -1) 
                break;

            let endPos = file.indexOf('\n', foundPos + 1);
            endPos = endPos === -1 ? file.length: endPos;
            arr.push(file.substring(foundPos, endPos));
            pos = foundPos + 1;
        }
    }
    return arr;
}

function findUser(command){
    let user_name = command.split(' ')[1].toLowerCase();
    for (let todo of todos){
        if (todo.split(';')[0].toLowerCase().endsWith(user_name)){
            fillTableRow(todo);
        }
    }
    renderTable();
}

function show(){
    for (let todo of todos)
        fillTableRow(todo);
    renderTable();
}

function important(){
    for (let todo of todos){
        if(todo.indexOf('!') != -1)
            fillTableRow(todo);
    }
    renderTable();
}

function findAfterDate(command){
    let date = new Date(command.split(' ')['1']);
    for (let todo of todos){
        if (new Date(todo.split(';')[1]) > date){
            fillTableRow(todo);
        }
    }
    renderTable();
}

function processCommand(command) {
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        case 'user':
            findUser(command);
            break;
        case 'date':
            findAfterDate(command);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!