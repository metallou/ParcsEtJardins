"use strict"

const KEYS = ["codepostal", "ville", "soustype"];

//callback method
function Data_Loaded(data)
{
    data = data.d;
    sortArray(data);
    data = buildTree(data, 0);
    createView(data);
}

function sortArray(data)
{
    let A;
    let min;
    for(let i=0; i<data.length-1; i++) {
        min = i;
        for(let j=i+1; j<data.length; j++) {
            if(data[min].codepostal > data[j].codepostal) {
                min = j;
            }
        }
        if(min != i) {
            A = data[min];
            data[min] = data[i];
            data[i] = A;
        }
    }
    console.log("data sorted by codepostal");
    for(let i=0; i<data.length-1; i++) {
        min = i;
        for(let j=i+1; j<data.length && data[i].codepostal==data[j].codepostal; j++) {
            if(data[min].ville > data[j].ville) {
                min = j;
            }
        }
        if(min != i) {
            A = data[min];
            data[min] = data[i];
            data[i] = A;
        }
    }
    console.log("data sorted bu ville");
    for(let i=0; i<data.length-1; i++) {
        min = i;
        for(let j=i+1; j<data.length && data[i].codepostal==data[j].codepostal && data[i].ville==data[j].ville; j++) {
            if(data[min].soustype > data[j].soustype) {
                min = j;
            }
        }
        if(min != i) {
            A = data[min];
            data[min] = data[i];
            data[i] = A;
        }
    }
    console.log("data sorted by soustype");
    for(let i=0; i<data.length-1; i++) {
        min = i;
        for(let j=i+1; j<data.length && data[i].codepostal==data[j].codepostal && data[i].ville==data[j].ville && data[i].soustype==data[j].soustype; j++) {
            if(data[min].raisonsociale > data[j].raisonsociale) {
                min = j;
            }
        }
        if(min != i) {
            A = data[min];
            data[min] = data[i];
            data[i] = A;
        }
    }
    console.log("data sorted by raisonsociale");
}

function buildTree(dt, key)
{
    if(key<KEYS.length) {
        let marr = [];
        let arr;
        let i=0;
        let j;
        while(i<dt.length) {
            arr = [];
            j=i;
            while(j<dt.length && dt[j][KEYS[key]]==dt[i][KEYS[key]]) {
                arr.push(dt[j]);
                j++;
            }
            i=j;
            marr.push(arr);
        }
        dt = marr;
        for(let i=0; i<marr.length; i++) {
            marr[i] = buildTree(marr[i], key+1);
        }
    }
    return dt;
}

function createView(dt)
{
    function getElemsLength(elem, key)
    {
        let sum = 0;
        if(key+1<KEYS.length) {
            for(let i=0; i<elem.length; i++) {
                sum += getElemsLength(elem[i], key+1);
            }
        } else {
            sum = elem.length;
        }
        return sum;
    }
    function getElemKey(elem, key)
    {
        let e = elem;
        for(let i=key; i<KEYS.length; i++) {
            e = e[0];
        }
        return e[KEYS[key]];
    }
    function createViewInner(dt, b, key)
    {
        if(key<KEYS.length) {
            b.classList.add(KEYS[key]);
            let marr = dt;
            let arr;
            let ul;
            let li;
            let div;
            for(let i=0; i<marr.length; i++) {
                arr = marr[i];
                li = document.createElement("li");
                b.appendChild(li);
                div = document.createElement("div");
                li.appendChild(div);
                div.textContent = getElemKey(dt[i], key) +" "+ "(" + getElemsLength(dt[i],key) + ")";
                div = document.createElement("div");
                div.classList.add("hidden");
                li.appendChild(div);
                ul = document.createElement("ul");
                div.appendChild(ul);
                createViewInner(arr, ul, key+1);
            }
        } else {
            let li;
            let section;
            let span;
            let empty = "N/I"
            for(let i=0; i<dt.length; i++) {
                li = document.createElement("li");
                b.appendChild(li);
                section = document.createElement("section");
                li.appendChild(section);
                span = document.createElement("span");
                section.appendChild(span);
                span.textContent = dt[i].raisonsociale || empty;
                span = document.createElement("span");
                section.appendChild(span);
                span.textContent = dt[i].voie || empty;
                span = document.createElement("span");
                section.appendChild(span);
                span.textContent = dt[i].latitude || empty;
                span = document.createElement("span");
                section.appendChild(span);
                span.textContent = dt[i].longitude || empty;
            }
        }
    }

    function removeClass(elem)
    {
        let elem2;
        elem.classList.add("hidden");
        for(let i=0; i<elem.children[0].children.length; i++) {
            elem2 = elem.children[0].children[i].children[1];
            if(elem2 != undefined) {
                removeClass(elem.children[0].children[i].children[1]);
            }
        }
    }

    function addEventListeners(b, key)
    {

        if(key<KEYS.length) {
            for(let i=0; i<b.children.length; i++) {
                 b.children[i].children[0].addEventListener("click", function(e)
                        {
                            let elem = e.currentTarget.parentNode.children[1];
                            if(elem.classList.contains("hidden")) {
                                elem.classList.remove("hidden");
                            } else {
                                removeClass(e.currentTarget.parentNode.children[1]);
                            }
                        });
                addEventListeners(b.children[i].children[1].children[0], key+1);
            }
        }
    }

    let placeholder = document.getElementById("dataPlaceholder2");
    placeholder.textContent = "";
    let ul = document.createElement("ul");
    placeholder.appendChild(ul);
    createViewInner(dt, ul, 0);
    addEventListeners(ul, 0);
}

document.addEventListener("DOMContentLoaded", function()
        {
            let script = document.createElement("script");
            script.src = "https://dataprovence.cloudapp.net:8080/v1/dataprovencetourisme/ParcsEtJardins/?url=http://dataprovence.cloudapp.net:8080/v1/dataprovencetourisme/ParcsEtJardins/?format=json&callback=Data_Loaded";
            document.head.appendChild(script);
        });
