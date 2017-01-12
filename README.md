# AngularJsModules
<ul>
<li>loadingSpinner</li>
</ul>

<h1>----loadingSpinner---------</h1>

Angular directive to show an animated spinner (using loadingSpinner-1.0.0.js)

Copyright (C) 2015, congwork@gmail.com

<h1>Usage</h1>

Include both loadingSpinner-1.0.0.js in your application.

<script src="loadingSpinner-1.0.0.js"></script>

Add the module myLoadingSpinner as a dependency to your app module:
<div class="highlight highlight-source-js">
<pre><span class="pl-k">var</span> myapp <span class="pl-k">=</span> angular.module(<span class="pl-s"><span class="pl-pds">'</span>myapp<span class="pl-pds">'</span></span>, [<span class="pl-s"><span class="pl-pds">'</span>myLoadingSpinner<span class="pl-pds">'</span></span>]);</pre></div>


You can now start using the my-loading directive to display an animated spinner. For example :
<div class="highlight highlight-text-html-basic">
<pre>&lt;<span class="pl-ent">my-loading</span> <span class="pl-e">show="loadingValue"</span>&gt;&lt;/<span class="pl-ent">my-loading</span>&gt;</pre></div>


the "show" attribute accepts value "true" or "false";

<h2>Example</h2>
<p><a href="http://plnkr.co/Auyi3VYnhIXsjBtw6yJ5" alt="loadingSpinner">LoadingSpinner</a></p>
<h2>License</h2>
<p>Released under the terms of MIT License.</p>
