# AngularJsModules

Angular directive to show an animated spinner (using loadingSpinner-1.0.0.js)

# loadingSpinner Directive

<h2>Demo</h2>
![loadingSpinner Directive Example](https://rawgit.com/congWork/AngularJsModules/master/loadingSpinner/demo.png)

<p><a href="http://plnkr.co/Auyi3VYnhIXsjBtw6yJ5" alt="loadingSpinner">LoadingSpinner</a></p>


<h2>Usage</h2>

Include both loadingSpinner-1.0.0.js in your application.

<script src="loadingSpinner-1.0.0.js"></script>

Add the module myLoadingSpinner as a dependency to your app module:
<div class="highlight highlight-source-js">
<pre><span class="pl-k">var</span> myapp <span class="pl-k">=</span> angular.module(<span class="pl-s"><span class="pl-pds">'</span>myapp<span class="pl-pds">'</span></span>, [<span class="pl-s"><span class="pl-pds">'</span>myLoadingSpinner<span class="pl-pds">'</span></span>]);</pre></div>


You can now start using the my-loading directive to display an animated spinner. For example :
<div class="highlight highlight-text-html-basic">
<pre>&lt;<span class="pl-ent">my-loading</span> <span class="pl-e">show="loadingValue"</span>&gt;&lt;/<span class="pl-ent">my-loading</span>&gt;</pre></div>


the "show" attribute accepts value "true" or "false";


<h2>License</h2>
  
<p>Use, reproduction, distribution, and modification of this code is subject to the terms and conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php</p>
