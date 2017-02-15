'use strict';

var R = require('ramda');
var faker = require('faker');
faker.locale = 'it';
var zlib = require('zlib');
// var zstd = require('node-zstd')
// var LZ4 = require('lz4')
var jsf = require('json-schema-faker');

var msgpack = require('msgpack');
if (!global._babelPolyfill) {
  require('babel-polyfill');
}
var getMicroservice = require('./microservice');
var t = require('tap');
var path = require('path');

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

t.test('*** NET MESSAGES COMPRESSION TEST ***', {
  autoend: true
}, function mainTest(t) {
  var SERVICE_1, CONFIG_1, DI_1, NET_1, service1Config, _ref, service2Config, SERVICE_2, CONFIG_2, DI_2, NET_2, _ref2, schema, testDataToSend, i, testEmit;

  return regeneratorRuntime.async(function mainTest$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          testEmit = function testEmit() {
            var start, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, data;

            return regeneratorRuntime.async(function testEmit$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    start = new Date();

                    NET_1.resetSerializedDataByte();
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 5;
                    _iterator = testDataToSend[Symbol.iterator]();

                  case 7:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context.next = 14;
                      break;
                    }

                    data = _step.value;
                    _context.next = 11;
                    return regeneratorRuntime.awrap(DI_1.emitEvent({ name: 'test', data: data }));

                  case 11:
                    _iteratorNormalCompletion = true;
                    _context.next = 7;
                    break;

                  case 14:
                    _context.next = 20;
                    break;

                  case 16:
                    _context.prev = 16;
                    _context.t0 = _context['catch'](5);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                  case 20:
                    _context.prev = 20;
                    _context.prev = 21;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }

                  case 23:
                    _context.prev = 23;

                    if (!_didIteratorError) {
                      _context.next = 26;
                      break;
                    }

                    throw _iteratorError;

                  case 26:
                    return _context.finish(23);

                  case 27:
                    return _context.finish(20);

                  case 28:
                    return _context.abrupt('return', { time: new Date() - start, dataByte: NET_1.getSerializedDataByte() });

                  case 29:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this, [[5, 16, 20, 28], [21,, 23, 27]]);
          };

          service1Config = {
            name: 'testMicroservice',
            httpPort: 8080,
            net: {
              netRegistry: require('./shared/netRegistry.json'),
              url: '0.0.0.0:8082'
            }
          };
          _context3.next = 4;
          return regeneratorRuntime.awrap(getMicroservice(service1Config));

        case 4:
          _ref = _context3.sent;
          SERVICE_1 = _ref.SERVICE;
          CONFIG_1 = _ref.CONFIG;
          DI_1 = _ref.DI;
          NET_1 = _ref.NET;
          service2Config = {
            name: 'authorizations',
            httpPort: 9090,
            net: {
              netRegistry: require('./shared/netRegistry.json'),
              url: '0.0.0.0:9092'
            }
          };
          _context3.next = 12;
          return regeneratorRuntime.awrap(getMicroservice(service2Config));

        case 12:
          _ref2 = _context3.sent;
          SERVICE_2 = _ref2.SERVICE;
          CONFIG_2 = _ref2.CONFIG;
          DI_2 = _ref2.DI;
          NET_2 = _ref2.NET;


          t.plan(1);

          schema = {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
              },
              name: {
                type: 'string',
                faker: 'name.findName'
              },
              email: {
                type: 'string',
                format: 'email',
                faker: 'internet.email'
              }
            },
            required: ['id', 'name', 'email']

          };
          testDataToSend = [];

          for (i = 0; i < 1000; i++) {
            testDataToSend.push(jsf(schema));
          }
          //console.log(testDataToSend)
          _context3.next = 23;
          return regeneratorRuntime.awrap(t.test('NO COMPRESSION', function _callee(t) {
            var result;
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(testEmit());

                  case 2:
                    result = _context2.sent;

                    t.ok(true, 'size ' + bytesToSize(result.dataByte));
                    t.ok(true, 'time ' + result.time / 1000 + ' s');
                    t.end();

                  case 6:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this);
          }));

        case 23:

          SERVICE_1.stop();
          SERVICE_2.stop();

        case 25:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy50ZXN0LmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZha2VyIiwibG9jYWxlIiwiemxpYiIsImpzZiIsIm1zZ3BhY2siLCJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsImdldE1pY3Jvc2VydmljZSIsInQiLCJwYXRoIiwiYnl0ZXNUb1NpemUiLCJieXRlcyIsInNpemVzIiwiaSIsInBhcnNlSW50IiwiTWF0aCIsImZsb29yIiwibG9nIiwicG93IiwidG9GaXhlZCIsInRlc3QiLCJhdXRvZW5kIiwibWFpblRlc3QiLCJ0ZXN0RW1pdCIsInN0YXJ0IiwiRGF0ZSIsIk5FVF8xIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJ0ZXN0RGF0YVRvU2VuZCIsImRhdGEiLCJESV8xIiwiZW1pdEV2ZW50IiwibmFtZSIsInRpbWUiLCJkYXRhQnl0ZSIsImdldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcnZpY2UxQ29uZmlnIiwiaHR0cFBvcnQiLCJuZXQiLCJuZXRSZWdpc3RyeSIsInVybCIsIlNFUlZJQ0VfMSIsIlNFUlZJQ0UiLCJDT05GSUdfMSIsIkNPTkZJRyIsIkRJIiwiTkVUIiwic2VydmljZTJDb25maWciLCJTRVJWSUNFXzIiLCJDT05GSUdfMiIsIkRJXzIiLCJORVRfMiIsInBsYW4iLCJzY2hlbWEiLCJ0eXBlIiwicHJvcGVydGllcyIsImlkIiwiZW1haWwiLCJmb3JtYXQiLCJyZXF1aXJlZCIsInB1c2giLCJyZXN1bHQiLCJvayIsImVuZCIsInN0b3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxRQUFRRCxRQUFRLE9BQVIsQ0FBWjtBQUNBQyxNQUFNQyxNQUFOLEdBQWUsSUFBZjtBQUNBLElBQUlDLE9BQU9ILFFBQVEsTUFBUixDQUFYO0FBQ0E7QUFDQTtBQUNBLElBQUlJLE1BQU1KLFFBQVEsbUJBQVIsQ0FBVjs7QUFFQSxJQUFJSyxVQUFVTCxRQUFRLFNBQVIsQ0FB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O0FBQ0FoQixvQkFBVWdCLElBQVY7O0FBcEVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoiZXZlbnRzLnRlc3QuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG5mYWtlci5sb2NhbGUgPSAnaXQnXG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKVxuLy8gdmFyIHpzdGQgPSByZXF1aXJlKCdub2RlLXpzdGQnKVxuLy8gdmFyIExaNCA9IHJlcXVpcmUoJ2x6NCcpXG52YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuXG52YXIgbXNncGFjayA9IHJlcXVpcmUoJ21zZ3BhY2snKVxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpIHtcbiAgcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxufVxudmFyIGdldE1pY3Jvc2VydmljZSA9IHJlcXVpcmUoJy4vbWljcm9zZXJ2aWNlJylcbnZhciB0ID0gcmVxdWlyZSgndGFwJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbmZ1bmN0aW9uIGJ5dGVzVG9TaXplIChieXRlcykge1xuICB2YXIgc2l6ZXMgPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJ11cbiAgaWYgKGJ5dGVzID09IDApIHJldHVybiAnbi9hJ1xuICB2YXIgaSA9IHBhcnNlSW50KE1hdGguZmxvb3IoTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coMTAyNCkpKVxuICBpZiAoaSA9PSAwKSByZXR1cm4gYnl0ZXMgKyAnICcgKyBzaXplc1tpXVxuICByZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgaSkpLnRvRml4ZWQoMSkgKyAnICcgKyBzaXplc1tpXVxufTtcblxudC50ZXN0KCcqKiogTkVUIE1FU1NBR0VTIENPTVBSRVNTSU9OIFRFU1QgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICB2YXIgU0VSVklDRV8xLCBDT05GSUdfMSwgRElfMSwgTkVUXzFcbiAgdmFyIHNlcnZpY2UxQ29uZmlnID0ge1xuICAgIG5hbWU6ICd0ZXN0TWljcm9zZXJ2aWNlJyxcbiAgICBodHRwUG9ydDogODA4MCxcbiAgICBuZXQ6IHtcbiAgICAgIG5ldFJlZ2lzdHJ5OiByZXF1aXJlKCcuL3NoYXJlZC9uZXRSZWdpc3RyeS5qc29uJyksXG4gICAgICB1cmw6ICcwLjAuMC4wOjgwODInXG4gICAgfVxuICB9XG4gIHsgKHsgU0VSVklDRTogU0VSVklDRV8xLCBDT05GSUc6IENPTkZJR18xLCBESTogRElfMSwgTkVUOiBORVRfMSB9ID0gYXdhaXQgZ2V0TWljcm9zZXJ2aWNlKHNlcnZpY2UxQ29uZmlnKSkgfVxuXG4gIHZhciBzZXJ2aWNlMkNvbmZpZyA9IHtcbiAgICBuYW1lOiAnYXV0aG9yaXphdGlvbnMnLFxuICAgIGh0dHBQb3J0OiA5MDkwLFxuICAgIG5ldDoge1xuICAgICAgbmV0UmVnaXN0cnk6IHJlcXVpcmUoJy4vc2hhcmVkL25ldFJlZ2lzdHJ5Lmpzb24nKSxcbiAgICAgIHVybDogJzAuMC4wLjA6OTA5MidcbiAgICB9XG4gIH1cbiAgdmFyIFNFUlZJQ0VfMiwgQ09ORklHXzIsIERJXzIsIE5FVF8yXG4gIHsgKHsgU0VSVklDRTogU0VSVklDRV8yLCBDT05GSUc6IENPTkZJR18yLCBESTogRElfMiwgTkVUOiBORVRfMiB9ID0gYXdhaXQgZ2V0TWljcm9zZXJ2aWNlKHNlcnZpY2UyQ29uZmlnKSkgfVxuXG4gIHQucGxhbigxKVxuXG4gIHZhciBzY2hlbWEgPSB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgaWQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIFwicGF0dGVyblwiOiBcIl5bYS1mQS1GMC05XXs4fS1bYS1mQS1GMC05XXs0fS1bYS1mQS1GMC05XXs0fS1bYS1mQS1GMC05XXs0fS1bYS1mQS1GMC05XXsxMn0kXCJcbiAgICAgIH0sXG4gICAgICBuYW1lOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmYWtlcjogJ25hbWUuZmluZE5hbWUnXG4gICAgICB9LFxuICAgICAgZW1haWw6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ2VtYWlsJyxcbiAgICAgICAgZmFrZXI6ICdpbnRlcm5ldC5lbWFpbCdcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnXSxcblxuICB9XG4gIHZhciB0ZXN0RGF0YVRvU2VuZCA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwMDsgaSsrKSB7XG4gICAgdGVzdERhdGFUb1NlbmQucHVzaChqc2Yoc2NoZW1hKSlcbiAgfVxuICAvL2NvbnNvbGUubG9nKHRlc3REYXRhVG9TZW5kKVxuICBhc3luYyBmdW5jdGlvbiB0ZXN0RW1pdCAoKSB7XG4gICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKVxuICAgIE5FVF8xLnJlc2V0U2VyaWFsaXplZERhdGFCeXRlKClcbiAgICBmb3IgKHZhciBkYXRhIG9mIHRlc3REYXRhVG9TZW5kKSB7XG4gICAgICBhd2FpdCBESV8xLmVtaXRFdmVudCh7bmFtZTogJ3Rlc3QnLCBkYXRhfSlcbiAgICB9XG4gICAgcmV0dXJuIHsgdGltZTogKG5ldyBEYXRlKCkgLSBzdGFydCksIGRhdGFCeXRlOiBORVRfMS5nZXRTZXJpYWxpemVkRGF0YUJ5dGUoKX1cbiAgfVxuXG4gIGF3YWl0IHQudGVzdCgnTk8gQ09NUFJFU1NJT04nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHZhciByZXN1bHQgPSBhd2FpdCB0ZXN0RW1pdCgpXG4gICAgdC5vayh0cnVlLCAnc2l6ZSAnICsgYnl0ZXNUb1NpemUocmVzdWx0LmRhdGFCeXRlKSlcbiAgICB0Lm9rKHRydWUsICd0aW1lICcgKyAocmVzdWx0LnRpbWUgLyAxMDAwKSArICcgcycpXG4gICAgdC5lbmQoKVxuICB9KVxuXG5cbiAgU0VSVklDRV8xLnN0b3AoKVxuICBTRVJWSUNFXzIuc3RvcCgpXG59KVxuIl19