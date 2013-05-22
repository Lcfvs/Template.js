var Template;
(function () {
    'use strict';
    var templates, window, document, documentURL, title, className, classNamePattern, listener,
        Template, parseURL, load, create, show, resetForms;
    templates = {};
    Template = function Template(scope, titleSuffix, activeClassName, ontemplatechange) {
        window = scope;
        document = window.document;
        documentURL = parseURL(document.location.href);
        title = titleSuffix;
        className = activeClassName;
        classNamePattern = new RegExp('(?:^|\s)' + className + '(?!\S)');
        listener = ontemplatechange;
        create(documentURL.url, document.querySelector('*[data-tpl-selector]') || document.documentElement);
        window.addEventListener('popstate', function (event) {
            var oldDocumentURL;
            if (documentURL.qualifiedHref !== document.location.href) {
                oldDocumentURL = documentURL;
                documentURL = event.state;
                show(oldDocumentURL);
            }
        }, false);
        document.addEventListener('click', function (event) {
            var anchor, anchorURL, oldDocumentURL, previousAnchor;
            if (event.target.nodeName === 'A') {
                anchor = event.target;
                anchorURL = parseURL(anchor.href);
                if (anchorURL.hostname === documentURL.hostname) {
                    if (anchorURL.qualifiedHref !== documentURL.qualifiedHref) {
                        oldDocumentURL = documentURL;
                        documentURL = anchorURL;
                        documentURL.title = anchor.textContent + title;
                        previousAnchor = document.getElementsByClassName(className)[0];
                        previousAnchor.className = previousAnchor.className.replace(classNamePattern, '');
                        anchor.className += className;
                        if (documentURL.url !== oldDocumentURL.url) {
                            if (!templates.hasOwnProperty(documentURL.url)) {
                                load(oldDocumentURL);
                            } else {
                                resetForms();
                                show(oldDocumentURL);
                            }
                        } else {
                            history.pushState(documentURL, document.title, documentURL.qualifiedHref);
                        }
                    }
                    event.preventDefault();
                    event.returnValue = false;
                    return false;
                }
            }
        }, false);
    };
    parseURL = function parseURL(href) {
        var span, qualifiedHref, hostname, url, hash;
        span = document.createElement('span');
        span.innerHTML = '<a href="' + href.split('&').join('&amp;').split('"').join('&quot;').split('<').join('&lt;') + '">&nbsp;</a>';
        qualifiedHref = span.firstChild.href;
        hostname = qualifiedHref.split('//')[1].split('/')[0].split(':')[0];
        url = qualifiedHref.split('#')[0];
        hash = qualifiedHref.substring(url.length);
        return {
            href: href,
            qualifiedHref: qualifiedHref,
            hostname: hostname,
            url: url,
            hash: hash
        };
    };
    load = function load(oldDocumentURL) {
        var url, xhr;
        url = documentURL.url;
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('VIEW_MODE', 'AJAX');
        xhr.onreadystatechange = function () {
            var doc, tpl;
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'tpl', null).firstChild;
                    doc.innerHTML = xhr.responseText;
                    templates[url] = doc;
                    tpl = doc.firstChild;
                    create(url, tpl);
                    show(oldDocumentURL);
                }
            }
        };
        xhr.send(null);
    };
    create = function create(url, tpl) {
        var doc, selector, expire;
        if (!templates.hasOwnProperty(url)) {
            doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'tpl', null).firstChild;
            templates[url] = doc;
        } else {
            doc = templates[url];
        }
        selector = tpl.getAttribute('data-tpl-selector');
        doc.selector = selector !== '' && selector !== null ? decodeURI(selector) : 'html';
        tpl.removeAttribute('data-tpl-selector');
        expire = parseInt(tpl.getAttribute('data-tpl-expire'), 10);
        if (!isNaN(expire)) {
            doc.time = (new Date()).getTime() + expire;
        }
    };
    show = function show(oldDocumentURL) {
        var url, hash, oldUrl, doc, tpl, targetNode, parentNode, nextNode;
        url = documentURL.url;
        hash = documentURL.hash;
        oldUrl = oldDocumentURL.url;
        doc = templates[url];
        tpl = doc.firstChild;
        if (!doc.hasOwnProperty('time') || (new Date()).getTime() < doc.time) {
            targetNode = document.querySelector(doc.selector);
            parentNode = targetNode.parentNode;
            nextNode = targetNode.nextSibling;
            templates[oldUrl].appendChild(targetNode);
            if (nextNode) {
                parentNode.insertBefore(tpl, nextNode);
            } else {
                parentNode.appendChild(tpl);
            }
            if (tpl.nodeName !== 'HTML') {
                document.title = documentURL.title;
            }
            history.pushState(documentURL, document.title, documentURL.qualifiedHref);
            if (listener) {
                listener(documentURL);
            }
        } else {
            load(oldDocumentURL);
        }
    };
    resetForms = function resetForms() {
        var forms, iterator, length;
        forms = templates[documentURL.url].querySelectorAll('form:not([data-tpl-noreset="true"])');
        length = forms.length;
        for (iterator = 0; iterator < length; iterator += 1) {
            forms[iterator].reset();
        }
    };
    self.Template = Template;
}());