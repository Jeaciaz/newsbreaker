'use strict';

var canvas;
var context;
var breakingNews;
var headline;
var time;
var label;
var live;
var img;

var date;
var ajax;

function init() {
    //Visual init----------------------------------------------------
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    date = new Date();
    setBNews('Breaking news');
    setHeadline('Headline');
    setTime();
    setLabel('Main plot');
    context.font = '900 42px Signika, Arial';
    setLive('Live');
    img = document.getElementById('img');
    img.onload = update;

    document.getElementById('headlineInput').addEventListener('input', function(event) {
        setHeadline(document.getElementById('headlineInput').value);
        update();
    });

    document.getElementById('headlineInput').value = '';

    document.getElementById('label').addEventListener('input', function (ev) {
        setLabel(document.getElementById('label').value);
        update();
    });

    document.getElementById('label').value = '';

    document.getElementById('img-src').addEventListener('input', function(ev) {
        setImage(document.getElementById('img-src').value);
        update();
    });

    document.getElementById('img-src').value = '';
    //Visual init----------------------------------------------------

    ajax = new XMLHttpRequest();
    document.getElementById('download-btn').addEventListener('mouseup', function() {
        canvas.toBlob(function(blob) {
            saveAs(blob, 'breakingnews.png');
        });
    });

    update();
}

function update() {
    try {
        var targetWid = 1280;
        var targetHei = 720;
        var wid = img.width;
        var hei = img.height;
        var mod = hei > wid ? targetWid / wid : targetHei / hei;
        wid *= mod;
        hei *= mod;
        var diffWid = targetWid - wid;
        var diffHei = targetHei - hei;
        context.drawImage(img, diffWid / 2, diffHei / 2, wid, hei);
    } catch (ex) {
        setImage('static/default_img.jpg');
    }

    fillRect('black', 80, 620, 100, 60);
    fillRect('#FEEB1A', 180, 620, 1100, 60);
    fillRect('#DEDEDE', 80, 510, 1200, 110);
    var gradient = context.createLinearGradient(80, 430, 80, 510);
    gradient.addColorStop(0, '#DF352B');
    gradient.addColorStop(0.49, '#B51009');
    gradient.addColorStop(0.5, '#AA0C03');
    gradient.addColorStop(1, '#6D2326');
    fillRect(gradient, 80, 430, 420, 80);
    fillRect('#C2150F', 80, 40, 105, 60);

    fillText('white', '46px', breakingNews, 103, 487);
    fillText('black', '68px', headline, 100, 590);
    fillText('white', '28px', time, 95, 660);
    fillText('black', '28px', label, 200, 660);
    fillText('white', '36px', live, 95, 85);
}

function fillRect(style, x, y, width, height) {
    context.fillStyle = style;
    context.fillRect(x, y, width, height);
}

function fillText(style, fontSize, text, x, y) {
    context.font = '900 ' + fontSize + ' Signika, Arial';
    context.fillStyle = style;
    context.fillText(text, x, y);
}

function setBNews(value) {
    breakingNews = value.toUpperCase();
}

function setTime() {
    time = date.getHours() + ":" + date.getMinutes();
}

function setHeadline(value) {
    headline = value.toUpperCase();
}

function setLabel(value) {
    label = value.toUpperCase();
}

function setLive(value) {
    live = value.toUpperCase();
}

function setImage(value) {
    img.src = value;
}

