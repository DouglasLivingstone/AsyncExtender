Async Extender
==============

Sets a [Knockout](http://knockoutjs.com/index.html) observable property to the
result of a [promise](http://wiki.commonjs.org/wiki/Promises/A). If the
observable's value is set directly, or set to a different promise, then the
first promise will be ignored.

A `loading` observable property is added to the extended observable, which
returns true while the asynchronous operation is in progress.

Demo
----

Extend an observable with the async extender, then bind it to the view model.
Once the promise resolves, the view model will be updated.

```javascript
  var viewModel = {
    message: ko.observable().extend({ async: true })
  };

  ko.applyBindings(viewModel);

  var request = jQuery.getJSON("http://echo.jsontest.com/message/hello");

  viewModel.message.setAsync(request.then(function(json) {
    return json.message;
  }));
```

```html
  <div data-bind="text: message"></div>
```

