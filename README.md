Template.js
===========


This project is a simple JavaScript template manager under the LGPL 3.0 license (http://www.gnu.org/licenses/lgpl-3.0.txt).

It transforms any link, pointing to the original domain of the page, in a template loader.

It can replace either a whole document or a document fragment.

Compatible with https://github.com/Lcfvs/Sandbox.js


Demo :
------

Temporary partial demo at http://lcfvs.github.io/Template.js/

Full demo soon


Syntax :
--------

<strong>Template(scope, titleSuffix, activeClassName, ontemplatechange);</strong>


The arguments :
---------------

[required] Window <strong>scope</strong> : the window that contains the document<br />

[required] String <strong>titleSuffix</strong> : the suffix of the document title which will be added to the text of the link clicked by the user<br />

[required] String <strong>activeClassName</strong> : the class name of the current template anchor<br />

[optional] Function <strong>ontemplatechange</strong> : the function that listens the templates display (a documentURL object passed to the specified event handler function)<br />


The HTML template attributes :
------------------------------

[optional] <strong>data-tpl-selector</strong> : if specified on the first HTML element of the template, it must contain a targeting element querySelector the template to replace, else, the document.documentElement is targeted by default (then useless if your template is a standalone document)

[optional] <strong>data-tpl-expire</strong> : if specified on the first HTML element of the template, it must contain an integer (in milliseconds) that represents the time after which the template must be reloaded (on click on the link)

[optional] <strong>data-tpl-noreset</strong> : if specifed on any &lt;form&gt;&lt;/form&gt; elements, all these forms, the value of this attribute is true, will the value of the child elements preserved, otherwise the form is reset before the template display


The documentURL properties :
----------------------------

String <strong>href</strong> : the anchor href (eg : "./index.html")

String <strong>qualifiedHref</strong> : the anchor qualifiedHref (eg : "http://www.example.com/index.html?test=value#hash")

String <strong>hostname</strong> : the anchor hostname (eg : "www.example.com")

String <strong>url</strong> : the anchor url, without hash (eg : "http://www.example.com/index.html?test=value")

String <strong>hash</strong> : the anchor hash (eg : "#hash")

String <strong>title</strong> : the document title (eg : "page title - title suffix")


Server side template request detection :
----------------------------------------

Any template request sends the header <strong>"VIEW_MODE"</strong> whose value is the string <strong>"AJAX"</strong>

For example, in PHP, you can retrieve it via <strong>apache_request_headers()</strong>


Requirements :
--------------

document.querySelector(), history.onpopState(), history.pushState(), XMLHttpRequest()
