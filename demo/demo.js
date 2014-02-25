jQuery(function() {

  var viewModel = {
    message: ko.observable().extend({ async: true })
  };

  ko.applyBindings(viewModel);

  var longRunningTask = new jQuery.Deferred();

  viewModel.message.setAsync(longRunningTask);

  setTimeout(function() {
    longRunningTask.resolve("Done!");
  }, 3000);

});
