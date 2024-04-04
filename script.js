let code_snippets = [];
let form = document.querySelector("form");
let checkbox = document.querySelector("#theme-changer");
let snippets_div = document.querySelector(".code-snippets");
let copy_button = document.querySelector(".copy-code");

code_snippets = JSON.parse(localStorage.getItem("code_snippets"));

console.log(code_snippets);
if (code_snippets === null) {
    code_snippets = [];
} else {
    code_snippets = JSON.parse(localStorage.getItem("code_snippets"));
}


// TEST CASE
// let code1 = {"snippet_title": "Hello World in Python", "snippet_code": "print('Hello World!')"};
// code_snippets.push(code1);

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let snippet_title = document.querySelector("#title").value;
    let snippet_code = document.querySelector("#code").value;
    let code = he.encode(snippet_code);

    code_snippets.push({
        "snippet_title": snippet_title,
        "snippet_code": code
    })

    renderSnippets(snippet_title, snippet_code);
    clearInputs()
    localStorage.setItem("code_snippets", JSON.stringify(code_snippets));

    console.log(code_snippets)
    console.log(code)
})

function clearInputs() {
    document.querySelector("#title").value = "";
    document.querySelector("#code").value = "";
}   


function renderSnippets(title, code) {

    let div = document.createElement("div");
    div.classList.add("snippet");

    let button = document.createElement("button");
    button.classList.add("copy-code");
    button.classList.add("snippet-button")
    button.innerHTML = `<i class="fa-solid fa-copy"></i>`;
    button.setAttribute("onclick", "copyCode(this)")

    let delete_button = document.createElement("button");
    delete_button.classList.add("delete-code");
    delete_button.classList.add("snippet-button")
    delete_button.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    delete_button.setAttribute("onclick", "deleteSnippet(this)");
    

    let h3 = document.createElement("h3");
    h3.textContent = title;

    let pre = document.createElement("pre");
    pre.classList.add("scroll-bar");

    let snippet_code = document.createElement("code");
    snippet_code.classList.add("scroll-bar");
    snippet_code.textContent = he.decode(code)
    hljs.highlightElement(snippet_code);

    pre.appendChild(snippet_code);

    div.append(button);
    div.appendChild(delete_button)
    div.appendChild(h3);
    div.append(pre);

    snippets_div.appendChild(div);
}


function copyCode(element) {
    let copied_msg = document.querySelector(".copied-msg");
    let codeToCopy = element.closest(".snippet").querySelector("pre code").textContent;
    

    navigator.clipboard.writeText(codeToCopy)
        .then(()=> {
            element.innerHTML = `<i class="fa-solid fa-check"></i>`;
            copied_msg.style.opacity = 1;
            
            setTimeout(() => {
                element.innerHTML = `<i class="fa-solid fa-copy"></i>`;
                copied_msg.style.opacity = 0;
            }, 1500);
        })
        .catch(()=> {
            console.error("Failed to copy the text");
            alert("Failed to copy the text!!!");
        })

}

function deleteSnippet(element) {

    let delete_confirm = document.querySelector(".confirmation-msg");
    let main = document.querySelector("main");
    let yes = document.querySelector(".yes");
    let no = document.querySelector(".no");

    main.style.opacity = "0.5"
    
    delete_confirm.style.opacity = "1";
    main.style.pointerEvents = "none";
    delete_confirm.style.pointerEvents = "auto"

    yes.addEventListener('click', function() {
        element.parentElement.remove();
        let toDelete = element.nextElementSibling.textContent;
        let elementToDelete = code_snippets.findIndex(snippet => snippet.snippet_title === toDelete);
        // delete code_snippets[elementToDelete];
        code_snippets.splice(elementToDelete, 1);
        localStorage.setItem("code_snippets", JSON.stringify(code_snippets));

        console.log(toDelete);
        console.log(elementToDelete);
        console.log(code_snippets);

        main.style.opacity = "1"
        delete_confirm.style.opacity = "0";
        main.style.pointerEvents = "auto";
        delete_confirm.style.pointerEvents = "none"
    })
    
    no.addEventListener('click', function() {
        main.style.opacity = "1"
        delete_confirm.style.opacity = "0";
        main.style.pointerEvents = "auto";
        delete_confirm.style.pointerEvents = "none"
    })
    
}


code_snippets.forEach((snippet)=> {
    let snippet_Title = snippet["snippet_title"];
    let snippet_Code = snippet["snippet_code"];
    
    renderSnippets(snippet_Title, snippet_Code);
})


//Few Shortcut keys
let textArea = document.querySelector("textarea")
textArea.addEventListener("keydown", function(e) {
    let start = textArea.selectionStart;
    let end = textArea.selectionEnd;
    if (e.key == "Tab") {
        e.preventDefault();
        let spaces = "    ";
        textArea.value = textArea.value.substring(0, start) + spaces + textArea.value.substring(end)
        textArea.selectionStart = start + spaces.length;
        textArea.selectionEnd = start + spaces.length;
    }

    if (e.key === `"` & e.code === `Quote`) {
        let quote = `"`;
        textArea.value = textArea.value.substring(0, start) + quote + textArea.value.substring(end);
        textArea.selectionStart = start + quote.length;
        textArea.selectionEnd = start + quote.length - 1;
    }

    if (e.key === "{" & e.code === "BracketLeft") {
        let bracketRight = "}"
        textArea.value = textArea.value.substring(0, start) + bracketRight + textArea.value.substring(end);
        textArea.selectionStart = start + bracketRight.length;
        textArea.selectionEnd = start + bracketRight.length - 1;
    }

    if (e.key === "(" & e.code === "Digit9") {
        let bracketRight = ")";
        textArea.value = textArea.value.substring(0, start) + bracketRight + textArea.value.substring(end);
        textArea.selectionStart = start + bracketRight.length;
        textArea.selectionEnd = start + bracketRight.length - 1;
    }
    console.log(e);
})

