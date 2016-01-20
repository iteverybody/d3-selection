var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.data(values) binds the specified values to the selected elements by index", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar", "baz"]);
  test.equal(one.__data__, "foo");
  test.equal(two.__data__, "bar");
  test.equal(three.__data__, "baz");
  test.deepEqual(selection, {
    _nodes: [[one, two, three]],
    _parents: [body],
    _enter: {
      _nodes: [[,,]],
      _parents: [body],
      _update: selection
    },
    _exit: {
      _nodes: [[,,]],
      _parents: [body]
    }
  });
  test.end();
});

tape("selection.data(values) puts unbound data in the enter selection", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar", "baz"]);
  test.equal(one.__data__, "foo");
  test.equal(two.__data__, "bar");
  test.deepEqual(selection, {
    _nodes: [[one, two,]],
    _parents: [body],
    _enter: {
      _nodes: [[,, {
        __data__: "baz",
        _next: null,
        _parent: body,
        namespaceURI: "http://www.w3.org/1999/xhtml",
        ownerDocument: body.ownerDocument
      }]],
      _parents: [body],
      _update: selection
    },
    _exit: {
      _nodes: [[,,]],
      _parents: [body]
    }
  });
  test.end();
});

tape("selection.data(values) puts unbound elements in the exit selection", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar"]);
  test.equal(one.__data__, "foo");
  test.equal(two.__data__, "bar");
  test.deepEqual(selection, {
    _nodes: [[one, two,]],
    _parents: [body],
    _enter: {
      _nodes: [[,,,]],
      _parents: [body],
      _update: selection
    },
    _exit: {
      _nodes: [[,, three]],
      _parents: [body]
    }
  });
  test.end();
});

tape("selection.data(values) binds the specified values to each group independently", function(test) {
  var body = jsdom.jsdom("<div id='zero'><span id='one'></span><span id='two'></span></div><div id='three'><span id='four'></span><span id='five'></span></div>").body,
      zero = body.querySelector("#zero"),
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      four = body.querySelector("#four"),
      five = body.querySelector("#five"),
      selection = d3.select(body).selectAll("div").selectAll("span").data(["foo", "bar"]);
  test.equal(one.__data__, "foo");
  test.equal(two.__data__, "bar");
  test.equal(four.__data__, "foo");
  test.equal(five.__data__, "bar");
  test.deepEqual(selection, {
    _nodes: [[one, two], [four, five]],
    _parents: [zero, three],
    _enter: {
      _nodes: [[,], [,]],
      _parents: [zero, three],
      _update: selection
    },
    _exit: {
      _nodes: [[,], [,]],
      _parents: [zero, three]
    }
  });
  test.end();
});

tape("selection.data(function) binds the specified return values to the selected elements by index", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(function() { return ["foo", "bar", "baz"]; });
  test.equal(one.__data__, "foo");
  test.equal(two.__data__, "bar");
  test.equal(three.__data__, "baz");
  test.deepEqual(selection, {
    _nodes: [[one, two, three]],
    _parents: [body],
    _enter: {
      _nodes: [[,,]],
      _parents: [body],
      _update: selection
    },
    _exit: {
      _nodes: [[,,]],
      _parents: [body]
    }
  });
  test.end();
});

tape("selection.data(function) passes the values function data, index and parents", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child></child><child></child></parent><parent id='two'><child></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      results = [];

  d3.selectAll([one, two])
      .datum(function(d, i) { return "parent-" + i; })
    .selectAll("child")
      .data(function(d, i, nodes) { results.push([this, d, i, nodes]); return [0, 1].map(function(j) { return "child-" + i + "-" + j; }); });

  test.deepEqual(results, [
    [one, "parent-0", 0, [one, two]],
    [two, "parent-1", 1, [one, two]]
  ]);
  test.end();
});
