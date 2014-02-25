/* Async Extender
 * Adds a setAsync method and a loading property to a Knockout observable.
 * When the promise resolves, the observable's value is set.
 */
ko.extenders.async = function(target) {

  var current = ko.observable(null);

  function abort() {
    var promise = current();
    if (promise && promise.abort) {
      promise.abort();
    }
  }

  target.setAsync = function(promise) {
    abort();
    current(promise);
    promise.then(function(value) {
      if (promise === current()) {
        current(null);
        target(value);
      }
    }, function() {
      current(null);
    });
  };

  target.loading = ko.computed(function() {
    return !!current();
  });

  target.subscribe(function() {
    abort();
    current(null);
  });

  return target;
};
