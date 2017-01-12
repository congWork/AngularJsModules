# AngularJsModules

Angular directive to show an animated spinner (using ccspinner.js)

# ccspinner Directive

<h2>Demo</h2>
![ccspinner Directive Example](https://github.com/congWork/AngularJsModules/blob/master/ccspinner/demo.PNG)

<p><a href="https://plnkr.co/ZHFNKJswOlCHRfbjfbhZ" alt="ccspinner">ccspinner</a></p>


<h2>Usage</h2>

1. Add the directive script ccspinner.js into your project and reference the `ccspinner` module:
2. Reference the `ccspinner` module:

```javascript
angular.module('app', ['ngAnimate','ui.router','ccspinner']);
```

3. Add the following styles into a CSS stylesheet (tweak as needed):

```css
  .ccspinner-background {
    top: 0px;
    left: 0px;
    position: absolute;
    z-index: 9999;
    height: 100%;
    width: 100%;
    background-color: #808080;
    opacity: 0.2;
     border-radius: 6px;
}
.ccspinner-content {
    position: absolute;
    font-weight: bold;
    height: 100px;
    width: 150px;
    z-index: 10000;
    text-align: center;
   
}
.centerBlock {
    display: block;
    height: auto;
    margin: 20% auto;
    overflow: hidden;
    width: 100%;
}
/*Optional Animations*/
.dissolve-animation.ng-hide-remove,
.dissolve-animation.ng-hide-add {
    display: inline !important;
    -webkit-transition: 0.5s linear all;
    -moz-transition: 0.5s linear all;
    -o-transition: 0.5s linear all;
    transition: 0.5s linear all;
}

.dissolve-animation.ng-hide-remove.ng-hide-remove-active,
.dissolve-animation.ng-hide-add {
     opacity: 1;
}

.dissolve-animation.ng-hide-add.ng-hide-add-active,
.dissolve-animation.ng-hide-remove {
     opacity: 0;
}

```

4. Add the directive into your main shell page:

```html
 <div ccspinner
     ccspinner-delay-in="50"
     ccspinner-delay-out="700"
     ccspinner-animation="dissolve-animation">
	 <!--below is a fontAwesome icon, you could use an spinning image instead-->
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span class="sr-only">Loading...</span>
        loading...
</div>
```
### Options

- `ccspinner-delay-in="50"` indicates the number of milliseconds to wait before showing the overlay. This is useful so we do not have a flicker for super short XHR. Default is 500 ms.
- `ccspinner-delay-out="700"` indicates the number of milliseconds to keep the overlay around after the last XHR has completed. Default is 500 ms.
- `ccspinner-animation="dissolve-animation"` indicates the CSS animation to apply. Must be an animation that supports the AngularJS standard for ngShow/ngHide. This is an optional setting. 

### Disable ccspinner

The ccspinner can be disabled for specific requests by setting the `hideOverlay` option to `true`
on either the angular http request config or the jquery ajax options objects.

- Angular

$http
```
$http({
    url: 'http://www.google.com',
    // ...
    hideOverlay: true,
});
```
$resource
```$resource
return $resource('http://www.google.com', {}, {
    get : {
        'hideOverlay':true
    }
});
```



<h2>License</h2>
  
<p>Use, reproduction, distribution, and modification of this code is subject to the terms and conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php</p>
