//BUILD PORTABLE W/ Command: 
//pkg -t node12-linux '/home/tolo/.misc/macros.js';
//Build for multiple : pkg -t node12-linux,node14-linux,node14-win '/home/tolo/.misc/macros.js'
//outputed portable pkgs files goes to home .misc/ dir
const os = require("os");
const fs = require('fs');
const gi = require('node-gtk');
const Gtk = gi.require('Gtk', '3.0');
const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const {
    execSync
} = require('child_process');
const {
    getTextOfJSDocComment
} = require("typescript");
const { clearTimeout } = require("timers");

gi.startLoop();
Gtk.init();

const win = new Gtk.Window();
win.on('destroy', () => mainQuit());

win.on('enter-notify-event', () => onWindowEnter(true));
win.on('leave-notify-event', () => onWindowEnter(false));
function onWindowEnter(boolie){
    if (win.getSize()[1] < 350) {
        if (boolie) {
            programBox.show();
            commandBox.show();
        } else {
            programBox.hide();
            commandBox.hide();
        }
    } else {
        programBox.show();
        commandBox.show();
    }
    GiganticFolderBox.hide();
    return boolie;     
}

function mainQuit() {
    clearTimeout(checkTimeout);
    clearInterval(myMouseOverScrubInterval);
    let text =
        `xdotool keyup Shift_L Control_L Alt_L;
    xmodmap -e "pointer = 1 2 3";
    pidof macros | xargs kill -9;
    exit;`;
    execSync(text);
    //console.log(String(stdout)); // stdout of the command if any
    Gtk.mainQuit();
}
win.on('delete-event', () => false);
win.modal = true;

let grid = new Gtk.Grid();
win.add(grid);

win.setDefaultSize(400, 600);
let thisProgramName = '✾°▾°❃';
windowSetTitle(thisProgramName);

function windowSetTitle(text) {
    win.setTitle(text);
}

let checkTiming = 1000;
let checkIdleMax = 3000;

//program window and text boxes
let programID = '';
let programName = '';
let _deltaProgramID = '';
let _deltaProgramName = '';


let commandBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL
});
const commandEntry = new Gtk.TextView({
    buffer: new Gtk.TextBuffer(),
    hexpand: false,
    vexpand: false
});
var commandBuffer = commandEntry.buffer;
let commTxt = localStorage.getItem('commText');
commandBuffer.text = !commTxt || commTxt == ''|| commTxt == null ? 'xprop;' : commTxt;
commandBox.add(commandEntry);

let programBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL
});
const programEntry = new Gtk.TextView({
    buffer: new Gtk.TextBuffer(),
    hexpand: false,
    vexpand: false
});
let programBuffer = programEntry.buffer;
programBuffer.text = programName;
programBox.add(programEntry);


function detectAndSetprogramNameAndID() {
    programName = _getProgramName(programID = _getProgramID());
    programName = programName == '' ? _deltaProgramName: programName;
    programID = _deltaProgramName == programName ? _deltaProgramID : programID;
    programBuffer.text = programName;
    return _deltaProgramName != programName;
}
detectAndSetprogramNameAndID();

function _getProgramID() {
    _deltaProgramID = programID;
    let text =
        `winID=$(xdotool getwindowfocus);
    echo $winID;`;
    let stdout = String(execSync(text)).split('\n').join('');
    console.log("ID " + stdout);
    return stdout;
}

function _getProgramName(winID) {
    _deltaProgramName = programName;
    let text =
        `winName=$(cat "/proc/$(xdotool getwindowpid "${winID}")/comm");
    if [ $winName = '' ] || [ $winName = '${thisProgramName}' ] || [ $winName = 'node' ] || [ $winName = 'gnome-shell' ] || [ $winName = 'macros' ]; then
        echo '${programName}';
    else
        echo $winName;
    fi;`;
    let stdout = String(execSync(text)).split('\n').join('');
    console.log("Program " + stdout);
    return stdout;
}
//gfx():
//buttons
let buttons = [];
let tabButton = new Gtk.Button({
    label: "TAB ⇥",
    expand: true
});
tabButton.xdo = 'key --clearmodifiers Tab keyup Tab';
buttons.push(['clicked', tabButton, 'tab']);

let ctrlZButton = new Gtk.Button({
    label: "Ctrl+Z",
    expand: true
});
ctrlZButton.xdo = 'key --clearmodifiers Control_L+z keyup Control_L+z';
buttons.push(['clicked', ctrlZButton, 'ctrlZ']);

let ctrlShiftZButton = new Gtk.Button({
    label: "Ctrl+Shift+Z",
    expand: true
});
ctrlShiftZButton.xdo = 'key --clearmodifiers Control_L+Shift_L+z keyup Control_L+Shift_L+z';
buttons.push(['clicked', ctrlShiftZButton, 'ctrlShiftZ']);

let ctrlYButton = new Gtk.Button({
    label: "Ctrl+Y",
    expand: true
});
ctrlYButton.xdo = 'key --clearmodifiers Control_L+y keyup Control_L+y';
buttons.push(['clicked', ctrlYButton, 'ctrlY']);

let shiftToggleButton = new Gtk.ToggleButton({
    label: "SHIFT ⌨",
    expand: true
});
shiftToggleButton.key = "Shift_L";
buttons.push(['released', shiftToggleButton, '']);
let ctrlToggleButton = new Gtk.ToggleButton({
    label: "CTRL ⌨",
    expand: true
});
ctrlToggleButton.key = "Control_L";
buttons.push(['released', ctrlToggleButton, '']);
let altToggleButton = new Gtk.ToggleButton({
    label: "ALT ⌨",
    expand: true
});
altToggleButton.key = "Alt_L";
buttons.push(['released', altToggleButton, '']);
let commandButton = new Gtk.Button({
    label: "Command ⌘",
    expand: true
});
buttons.push(['clicked', commandButton, 'command']);
commandButton.t = '\n\t\n\t';
let copyButton = new Gtk.Button({
    label: "COPY",
    expand: true
});
copyButton.xdo = 'key --clearmodifiers Control_L+c keyup Control_L+c';
buttons.push(['clicked', copyButton, 'copy']);
let cutButton = new Gtk.Button({
    label: "CUT",
    expand: true
});
cutButton.xdo = 'key --clearmodifiers Control_L+x keyup Control_L+x';
buttons.push(['clicked', cutButton, 'cut']);
let pasteButton = new Gtk.Button({
    label: "PASTE",
    expand: true
});
pasteButton.xdo = 'key --clearmodifiers Control_L+v keyup Control_L+v';
buttons.push(['clicked', pasteButton, 'paste']);

let f11Button = new Gtk.Button({
    label: "F11 ⤢",
    expand: true
});
f11Button.xdo = 'key --clearmodifiers F11 keyup F11';
buttons.push(['clicked', f11Button, 'f11']);

let returnButton = new Gtk.Button({
    label: "RETURN",
    expand: true
});
returnButton.xdo = 'key --clearmodifiers Return keyup Return';
buttons.push(['clicked', returnButton, 'return']);


let moreToggleButton = new Gtk.ToggleButton({
    label: "MORE",
    expand: true
});
moreToggleButton.more = function () {
    if (moreToggleButton.getActive()) {
        ctrlZButton.show();
        ctrlShiftZButton.show();
        ctrlYButton.show();
        f11Button.show();
    } else {
        ctrlZButton.hide();
        ctrlShiftZButton.hide();
        ctrlYButton.hide();
        f11Button.hide();
    }
    if (menuSwapToggleButton.getActive()) {
        keepOnTopToggleButton.setLabel(keepOnTopToggleButton._label + '✔' + menuSwapToggleButton.t);
        moreToggleButton.hide();
    } else {
        menuSwapToggleButton.setLabel(menuSwapToggleButton._label + menuSwapToggleButton.t);
        moreToggleButton.show();
    }
    return '';
}
buttons.push(['released', moreToggleButton, 'more']);
let menuSwapToggleButton = new Gtk.ToggleButton({
    label: "Swap ⇋ 🖱",
    expand: true
});
menuSwapToggleButton.t = '\n\t\n\t';
buttons.push(['released', menuSwapToggleButton, 'menuSwap']);

let keepOnTopToggleButton = new Gtk.ToggleButton({
    label: "Keep On Top  ▶ ",
    expand: true
});
buttons.push(['released', keepOnTopToggleButton, 'KeepOnTop']);

const image = new Gtk.Image({
    vexpand: true,
    opacity: 0.75
});
//image.set_from_file('samp.jpeg');
image.setFromFile('./DiscipleAI.png');


let GiganticFolderBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    expand: false
});
GiganticFolderBox.add(image);
win.add(GiganticFolderBox);

//buttons.push(['released', GiganticFolderBox, 'GiganticFolder']);

/*GiganticFolderBox.connect('click', () => {
    GiganticFolderBox.hide();
});*/


//assending layers
//top
grid.attach(keepOnTopToggleButton, 0, -1, 3, 1);
grid.attach(GiganticFolderBox, 0, -1, 3, 6);
grid.attach(programBox, 0, 0, 1, 1);
grid.attach(commandBox, 1, 0, 2, 1);
grid.attach(f11Button, 1, 1, 1, 1);
grid.attach(returnButton, 2, 1, 1, 1);
grid.attach(moreToggleButton, 2, 3, 1, 1);
grid.attach(ctrlZButton, 0, 1, 1, 1);
grid.attach(ctrlShiftZButton, 0, 2, 1, 1);
grid.attach(ctrlYButton, 0, 3, 1, 1);
//bottom
grid.attach(tabButton, 0, 0, 1, 1);
grid.attach(shiftToggleButton, 0, 1, 1, 1);
grid.attach(ctrlToggleButton, 0, 2, 1, 1);
grid.attach(altToggleButton, 0, 3, 1, 1);
grid.attach(commandButton, 1, 0, 2, 2);
grid.attach(menuSwapToggleButton, 1, 2, 2, 2);
grid.attach(copyButton, 0, 4, 1, 1);
grid.attach(cutButton, 1, 4, 1, 1);
grid.attach(pasteButton, 2, 4, 1, 1);
win.showAll();

//release toggle button/macro when mouse/stylus hovers over button
var myMouseOverScrubInterval = null;
var pos;

function myMouseOverScrub(button) {
    pos = 0;
    clearInterval(myMouseOverScrubInterval);
    myMouseOverScrubInterval = null;
    myMouseOverScrubInterval = setInterval(frame, 300);

    function frame() {
        if (pos == 5) {
            clearInterval(myMouseOverScrubInterval);
            myMouseOverScrubInterval = null;
            button.setLabel(button._label + button.t);
            button.setActive(false);
            Main(programBuffer.text);
        } else {
            pos++;
            button.setLabel(button.getLabel().split('\n\t').join('') + "▨" + button.t);
        };
    };
};

//assign functions to buttons
for (var i = 0; i < buttons.length; i++) {
    let buttonName = buttons[i][2];
    let buttonThis = buttons[i][1];
    let buttonFunc = buttons[i][0];
    buttonThis.t = buttonThis.t ? buttonThis.t : '';
    buttonThis._label = buttonThis.label;
    buttonThis.name = buttonName;
    buttonThis.setLabel(buttonThis._label + buttonThis.t);
    if (buttonName != 'Command ⌘' &&
        buttonName != 'tab' &&
        buttonName != 'ctrlZ' &&
        buttonName != 'ctrlShiftZ' &&
        buttonName != 'ctrlY' &&
        buttonName != 'copy' &&
        buttonName != 'cut' &&
        buttonName != 'paste' &&
        buttonName != 'f11' &&
        buttonName != 'return' &&
        buttonName != 'menuSwap')
        buttonThis.connect(buttonFunc, () => {
            clearInterval(myMouseOverScrubInterval);
            myMouseOverScrubInterval = null;
            Main(programBuffer.text, '', buttonThis.xdo);
            if (buttonFunc == 'released') {
                if (buttonThis.getActive())
                    buttonThis.setLabel(buttonThis._label + '✔' + buttonThis.t);
                else
                    buttonThis.setLabel(buttonThis._label + buttonThis.t);
            }
        });

    if (buttonFunc == 'released') {
        buttonThis.connect('enter', () => {
            if (!buttonThis.getActive()) return;
            if (keepState == 'active' || buttonThis.name == 'KeepOnTop')
                buttonThis.setLabel(buttonThis._label + '✔' + "\n↺" + buttonThis.t);
            else
                buttonThis.setLabel(buttonThis._label + "\n↺" + buttonThis.t);
            myMouseOverScrub(buttonThis);
        });
        buttonThis.connect('leave', () => {
            clearInterval(myMouseOverScrubInterval);
            myMouseOverScrubInterval = null;
            if (!buttonThis.getActive()) return;
            if (keepState == 'active' || buttonThis.name == 'KeepOnTop')
                buttonThis.setLabel(buttonThis._label + '✔' + buttonThis.t);
            else
                buttonThis.setLabel(buttonThis._label + buttonThis.t);
        });
    };
};

//assign functions to buttons cont...

commandButton.connect('clicked', () => {
    localStorage.setItem('commText', commandBuffer.text);
    Main(programBuffer.text, commandBuffer.text);
});
tabButton.connect('clicked', () => {
    Main(programBuffer.text, '', tabButton.xdo);
});
ctrlZButton.connect('clicked', () => {
    Main(programBuffer.text, '', ctrlZButton.xdo);
});
ctrlShiftZButton.connect('clicked', () => {
    Main(programBuffer.text, '', ctrlShiftZButton.xdo);
});
ctrlYButton.connect('clicked', () => {
    Main(programBuffer.text, '', ctrlYButton.xdo);
});
copyButton.connect('clicked', () => {
    Main(programBuffer.text, '', copyButton.xdo);
});
cutButton.connect('clicked', () => {
    Main(programBuffer.text, '', cutButton.xdo);
});
pasteButton.connect('clicked', () => {
    Main(programBuffer.text, '', pasteButton.xdo);
});
f11Button.connect('clicked', () => {
    Main(programBuffer.text, '', f11Button.xdo);
});
returnButton.connect('clicked', () => {
    Main(programBuffer.text, '', returnButton.xdo);
});
menuSwapToggleButton.connect('released', () => {
    clearInterval(myMouseOverScrubInterval);
    myMouseOverScrubInterval = null;
    Main(programBuffer.text);
});

var combineStrActive;
var combineStrNoActive;
var menuSwapStr;

function checkToggleModifiers(activateWin) {
    let tabStrActive = '';
    let shiftStrActive = '';
    let ctrlStrActive = '';
    let altStrActive = '';
    let tabStrNoActive = '';
    let shiftStrNoActive = '';
    let ctrlStrNoActive = '';
    let altStrNoActive = '';
    combineStrActive = '';
    combineStrNoActive = '';
    menuSwapStr = '';

    //if (tabButton.getActive()) tabStrActive = 'Tab';
    if (shiftToggleButton.getActive()) shiftStrActive = 'Shift_L';
    if (ctrlToggleButton.getActive()) ctrlStrActive = 'Control_L';
    if (altToggleButton.getActive()) altStrActive = 'Alt_L';
    combineStrActive = `${tabStrActive} ${shiftStrActive} ${ctrlStrActive} ${altStrActive} `;
    if (combineStrActive.length > 4) {
        combineStrActive = `xdotool ${activateWin} keydown --clearmodifiers ${combineStrActive};`;
    }

    //if (!tabButton.getActive()) tabStrNoActive = 'Tab';
    if (!shiftToggleButton.getActive()) shiftStrNoActive = 'Shift_L';
    if (!ctrlToggleButton.getActive()) ctrlStrNoActive = 'Control_L';
    if (!altToggleButton.getActive()) altStrNoActive = 'Alt_L';
    combineStrNoActive = `${tabStrNoActive} ${shiftStrNoActive} ${ctrlStrNoActive} ${altStrNoActive}`;
    if (combineStrNoActive.length > 4) {
        combineStrNoActive = `xdotool keyup ` + combineStrNoActive + `;`;
    }

    if (menuSwapToggleButton.getActive()) {
        menuSwapStr = 'xmodmap -e "pointer = 3 2 1";';
    } else {
        menuSwapStr = 'xmodmap -e "pointer = 1 2 3";';
    }

    moreToggleButton.more();
}

var checkTimeout = null;
function Main(programText = '', commandText = '', xdotoolText = '') {
    let activateWin = programText != '' ? `windowactivate --sync "${programID}"` : '';

    //accelerate checking
    checkTiming = 500;

    checkToggleModifiers(activateWin);

    if (xdotoolText.length > 4) {
        xdotoolText = `xdotool ${activateWin} ${xdotoolText};`;
        combineStrActive = ' ';
        combineStrNoActive = `Shift_L Control_L Alt_L`;
        combineStrNoActive = `xdotool keyup ` + combineStrNoActive + `;`;
    }

    if (keepOnTopToggleButton.getActive()) {
        win.setKeepAbove(true);
    } else {
        win.setKeepAbove(false);
    }

    let stdout = execMainCommands(programText, commandText, xdotoolText);
    console.log(stdout); // stdout of the command if any

    clearTimeout(checkTimeout);
    if (xdotoolText.length > 4) {
        Main(programText);
    } else {
        checkTimeout = setTimeout(() => {
            checkProgram(programBuffer.text);
        }, checkTiming);
    }
}

function setAllSensitive(boolean) {
    for (var i = 0; i < buttons.length; i++) {
        let buttonName = buttons[i][2];
        let buttonThis = buttons[i][1];
        if (buttonName != "KeepOnTop" &&
            buttonName != "more")
            buttonThis.setSensitive(boolean);
    }
}

function setAllActive(boolean) {
    for (var i = 0; i < buttons.length; i++) {
        let buttonName = buttons[i][2];
        let buttonThis = buttons[i][1];
        let buttonFunc = buttons[i][0];
        if (buttonFunc == 'released')
            if (buttonName != "KeepOnTop" &&
                buttonName != "more")
                buttonThis.setActive(boolean);
    }
}

function setAllActiveLables() {
    for (var i = 0; i < buttons.length; i++) {
        let buttonName = buttons[i][2];
        let buttonThis = buttons[i][1];
        let buttonFunc = buttons[i][0];
        if (buttonFunc == 'released')
            if (buttonThis.getActive())
                buttonThis.setLabel(buttonThis._label + '✔' + buttonThis.t);
            else
                buttonThis.setLabel(buttonThis._label + buttonThis.t);
    }
}

var keepState;

function checkProgram(programText = '') {
    if (programText != programName || programText == '' || programName == '') {
        //accelerate checking
        checkTiming = 500;
        if (!detectAndSetprogramNameAndID())
            return;
    };

    let activateWin = programText != '' ? `windowactivate --sync "${programID}"` : '';

    //decelerate checking
    if (checkTiming == checkIdleMax) GiganticFolderBox.show();
    checkTiming = checkTiming <= checkIdleMax ? checkTiming+100 : checkTiming;
    

    let state = execGetWindowState();
    // Force active when no text in box
    if (state == 'Target:Active' && keepState != 'active') {
        console.log(keepState = 'active');
        windowSetTitle(thisProgramName + " " + programName + '✔');
        setAllSensitive(true);
        setAllActiveLables();
        checkToggleModifiers(activateWin);

        let stdout = execTimeoutCommands();
    }
    if (state == 'Target:Open' && keepState != 'open') {
        console.log(keepState = 'open');
        programBuffer.text = '';
        windowSetTitle(thisProgramName);
        setAllActive(false);
        setAllActiveLables();
        moreToggleButton.more();

        let stdout = execClearModifiers();
    }
    if (state == 'Target:Closed' && keepState != 'closed') {
        console.log(keepState = 'closed');
        clearTimeout(checkTimeout);
        checkTimeout = null;

        //break program ID
        programName = '';
        programID = '';
        programBuffer.text = '';
        windowSetTitle(thisProgramName);
        setAllSensitive(false);
        setAllActive(false);
        setAllActiveLables();
        moreToggleButton.more();

        let stdout = execClearModifiers();
    }

    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(() => {
        checkProgram(programBuffer.text);
    }, checkTiming);
}

function execTimeoutCommands() {
    return execSync(`
        ${combineStrNoActive}
        ${combineStrActive}
        ${menuSwapStr}
    `);
}

function execMainCommands(programText = '', commandText = '', xdotoolText = '') {
    let activateWin = `xdotool windowactivate --sync "${programID}"`;
    combineStrActive = combineStrActive.length > 4 ? combineStrActive : activateWin;

    return String(execSync(`if [ "$(xdotool getwindowfocus)" = "${programID}" ];
    then
        echo "${programText} is Active.";
        echo "Mods are Active.";
        ${combineStrNoActive}
        ${combineStrActive}
        ${menuSwapStr}
        ${xdotoolText}
        ${commandText}
    elif xdotool getwindowpid "${programID}";
    then
        echo "${programText} is Open and now Active";
        echo "Mods are Active.";
        ${combineStrNoActive}
        ${combineStrActive}
        ${menuSwapStr}
        ${xdotoolText}
        ${commandText}
    else
        echo "${programText} is Closed.";
        echo "Mods not Active.";
        xdotool keyup Shift_L Control_L Alt_L;
        xmodmap -e "pointer = 1 2 3";
    fi;`));
}

function execGetWindowState() {
    return String(execSync(`if [ "$(xdotool getwindowfocus)" = "${programID}" ];
    then
        echo "Target:Active";
    elif [ $(xdotool getwindowpid "${programID}") ];
    then
        echo "Target:Open";
    else
        echo "Target:Closed";
    fi;`)).split('\n').join('');
}

function execClearModifiers() {
    combineStrActive = '';
    combineStrNoActive = '';
    menuSwapStr = '';
    return execSync(`xdotool keyup Shift_L Control_L Alt_L;
    xmodmap -e "pointer = 1 2 3";`);
}


Main();
Gtk.main();
