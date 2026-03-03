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

function sort(whatToSort){

    switch(whatToSort){
        case 'user':
            todos.sort((a, b) => (
                a.split('; ')[0].toLowerCase() > b.split('; ')[0].toLowerCase() ? 1 : -1
            ));
            break
        case 'importance':
            todos.sort((a, b) => (- a.indexOf('!') + b.indexOf('!')));
            break
        case 'date':
            todos.sort((a, b) => {
                const dateA = new Date(a.split('; ')[1]);
                const dateB = new Date(b.split('; ')[1]);
                
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
                
                return dateB - dateA;
            });
            break  
    }

    for(let todo of todos)
        console.log(todo) 
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
        case 'sort':
            sort(command.split(' ')[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
