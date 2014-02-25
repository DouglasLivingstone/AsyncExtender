describe("async extender", function() {
  
  beforeEach(function() {
    this.property = ko.observable(null).extend({ async: true });
    this.promise = new jQuery.Deferred();
  });

  describe("current value tracking", function() {

    it("works like a normal observable", function() {
      expect(this.property()).toBe(null);
      this.property(4);
      expect(this.property()).toBe(4);
      this.property(null);
      expect(this.property()).toBe(null);
    });

    it("retains its old value while the promise is unresolved", function() {
      this.property.setAsync(this.promise);
      expect(this.property()).toBe(null);
    });

    it("takes on the value of the promise once it is resolved", function() {
      this.property.setAsync(this.promise);
      this.promise.resolve(4);
      expect(this.property()).toBe(4);
    });

    it("ignores rejected promises", function() {
      this.property.setAsync(this.promise);
      this.promise.reject();
      expect(this.property()).toBe(null);
    });

    it("setting the property directly discards the promise", function() {
      this.property.setAsync(this.promise);
      this.property(4);
      expect(this.property()).toBe(4);
      this.promise.resolve(5);
      expect(this.property()).toBe(4);
    });

    it("ignores the promise if a second promise is set", function() {
      var promise2 = new jQuery.Deferred();
      this.property.setAsync(this.promise);
      this.property.setAsync(promise2);
      this.promise.resolve(4);
      expect(this.property()).toBe(null);
      promise2.resolve(5);
      expect(this.property()).toBe(5);
    });

  });

  describe("loading state property", function() {
    
    it("is not loading initially", function() {
      expect(this.property.loading()).toBe(false);
    });

    it("is loading once the promise is set", function() {
      this.property.setAsync(this.promise);
      expect(this.property.loading()).toBe(true);
    });

    it("stops loading once the promise is resolved", function() {
      this.property.setAsync(this.promise);
      this.promise.resolve(4);
      expect(this.property.loading()).toBe(false);
    });

    it("stops loading once the promise is rejected", function() {
      this.property.setAsync(this.promise);
      this.promise.reject();
      expect(this.property.loading()).toBe(false);
    });

    it("stops loading if the property is set directly", function() {
      this.property.setAsync(this.promise);
      this.property(4);
      expect(this.property.loading()).toBe(false);
    });

  });

  describe("aborting requests", function() {

    function spyOnAbort(promise) {
      // emulate jQuery.ajax().abort()
      promise.abort = function() {
        promise.reject();
      };
      spyOn(promise, "abort");
    }

    beforeEach(function() {
      spyOnAbort(this.promise);
    });

    it("does not try to abort the promise if the promise is resolved", function() {
      this.property.setAsync(this.promise);
      this.promise.resolve(4);
      expect(this.promise.abort).not.toHaveBeenCalled();
    });

    it("does not try to abort the promise if the promise is rejected", function() {
      this.property.setAsync(this.promise);
      this.promise.reject();
      expect(this.promise.abort).not.toHaveBeenCalled();
    });

    it("aborts the promise if the value is set directly", function() {
      this.property.setAsync(this.promise);
      this.property(4);
      expect(this.promise.abort).toHaveBeenCalled();
    });

    it("aborts the promise if the promise is replaced", function() {
      var promise2 = new jQuery.Deferred();
      spyOnAbort(promise2);
      this.property.setAsync(this.promise);
      this.property.setAsync(promise2);
      expect(this.promise.abort).toHaveBeenCalled();
      expect(promise2.abort).not.toHaveBeenCalled();
    });

  });

});
