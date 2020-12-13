# GraphGo Frontend

This is the web frontend app of GraphGo, developed with React.js and bootstrapped with create-react-app.

## How to use

### Canvas Page
After opening the app, you will be navigated to the Canvas Page, where you can draw and animate array data structure using the following tools.

* Pen tool:
    You can select this tool to draw on canvas。
* Hand tool:
    You can select this tool to control recognized SmartObject. A Animation Menu would appear after you click on a SmartObject.
* Selection tool:
    You can select this tool to create a bounding box for handwritten array and convert it to SmartObject.
* Eraser tool:
    You can select this tool to erase drawings on canvas. 
* Redo, Undo tool:
    To go back/ forward one stroke drawn on canvas.
* Save tool:
    You can save the current graph to your personal workspace if you have logged in. The graph will be saved to the root directory of your workspace by default.

### Content Management Page
After logging into you account on Canvas Page, a "Workspace" button would appear on the top right corner of the screen, clicking on it would navigate you to your personal workspace where your saved graphs are stored and displayed. 

* Navigating your workspace:
    You see the folders and graphs in your workspace after they finish loading, you can navigate them by clicking on the folder/ graph icon. 
* Create a new folder/ graph:
    You can use the "+" button to name and create new folder/ graph. After you create a graph, you would be navigated to the Canvas Page where you can edit it. 


## Known Bugs and Issues

1. Currently, palm rejection is not implemented in our drawing tool, which means your palm may accidentally trigger painting on the canvas. Please feel free to erase them if necessary. 
2. Overlaying lasso selection boxes is not supported, please do not attempt to convert overlaid lasso selection to smart objects.
3. 
    1. Due to implementation limitations, our Hand Writing Recognition (HWR) engine only supports annotation of arrays with opening and closing brackets, i.e. [1, 2, 3] will be successfully registered as an array, while 1 2 3 will produce unexpected results. 
    2. In addition, you should keep a reasonable distance between numbers and other symbols such that any symbol does not overlap with the rectangular bounding box of another. 
    3. Comma demilinator should be small enough (~ 1/10 the size of numbers) for the algorithm to recognize it correctly. 

## Troubleshooting
Please hard refresh (empty cache) the webpage if any unexpected behavior occurs. 

## Technical Contact Information
* Peter Wu, Email: bwu@ucsd.edu, Phone: 8582578471
* Jinhao Liu, Email: jil037@ucsd.edu

## Device Requirement

### Number of Required Devices
1

### Minimum Device Requirement
Windows 7, Windows 8, Windows 8.1, Windows 10 or later. An Intel Pentium 4 processor or later that's SSE3 capable. OR OS X Yosemite 10.10 or later. OR 64-bit Ubuntu 14.04+, Debian 8+, openSUSE 13.3+, or Fedora Linux 24+. An Intel Pentium 4 processor or later that's SSE3 capable. Please use the Google Chrome Browser. We strongly advise you to use our application in tablets, such as the iPad, with a writing apparatus, such as the Apple Pencil. 

## Installation Instructions

To start with a clean installation, after cloning the app, you can run `npm install` in the project root directory to install dependencies and start the app in development with `npm start`

### Avaliable Scripts
In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `serve -s build`
This command could be run after build script finishes to serve a production build of the app locally. The app is default to server at [http://localhost:5000](http://localhost:5000)

## Example of MVC
Our Content Management System (CMS) perfectly showcases the MVC design pattern. As src/views/CMS/CMS.js illustrates the View and Controller side of the pattern in function render() and onCreatePopupConfrim(), respectively. Data model is showcased by an API call to createFolder() function at src/API/file.js, which then handles data retrieval from our backend server. 

## Example of Layering
Macroscopically, layering is showcased in general idea of design throughout our product. Our product dissects various layers of use cases and places them into respective layers. For example, at presentation layer, in src/components/ToolBar/ToolBar.js:53 handleToolSelected(toolName) function, a user triggered tool switch is handled without database access. On the other hand, login(email, password) function in src/API/user.js:56 interfaces directly with database, responding to an invocation from presentation level trigger.

## Testing accounts

### Login credential with pre-populated data
Account: hal016@ucsd.edu; Password: 12345678