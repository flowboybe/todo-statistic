const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = findTodos()

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
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
            console.log(todo);
        }
    }
}

function show(){
    for(let todo of todos)
        console.log(todo);
}

function important(){
    for(let todo of todos){
        if(todo.indexOf('!') != -1)
            console.log(todo);
    }
}

function findAfterDate(command){
    let date = new Date(command.split(' ')['1']);
    for (let todo of todos){
        if (new Date(todo.split(';')[1]) > date){
            console.log(todo);
        }
    }
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