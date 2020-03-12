'use strict';

let logtopus = require('../logtopus').getLogger('test');

logtopus.setLevel('debug');
logtopus.setLevel('debug', 123);
logtopus.setLevel('debug', 'String arg');
logtopus.setLevel('debug', { foo: 'bar' });
logtopus.setLevel('debug', ['foo', 'bar']);
logtopus.setLevel('debug', null);
logtopus.setLevel('debug', true);
logtopus.setLevel('debug', false);
logtopus.setLevel('debug', undefined);

logtopus.debug('Debug log');
logtopus.debug('Debug log', 123);
logtopus.debug('Debug log', 'String arg');
logtopus.debug('Debug log', { foo: 'bar' });
logtopus.debug('Debug log', ['foo', 'bar']);
logtopus.debug('Debug log', null);
logtopus.debug('Debug log', true);
logtopus.debug('Debug log', false);
logtopus.debug('Debug log', undefined);

logtopus.info('Info log');
logtopus.info('Info log', 123);
logtopus.info('Info log', 'String arg');
logtopus.info('Info log', { foo: 'bar' });
logtopus.info('Info log', ['foo', 'bar']);
logtopus.info('Info log', null);
logtopus.info('Info log', true);
logtopus.info('Info log', false);
logtopus.info('Info log', undefined);

logtopus.res('Response log');
logtopus.res('Response log', 123);
logtopus.res('Response log', 'String arg');
logtopus.res('Response log', { foo: 'bar' });
logtopus.res('Response log', ['foo', 'bar']);
logtopus.res('Response log', null);
logtopus.res('Response log', true);
logtopus.res('Response log', false);
logtopus.res('Response log', undefined);

logtopus.req('Request log');
logtopus.req('Request log', 123);
logtopus.req('Request log', 'String arg');
logtopus.req('Request log', { foo: 'bar' });
logtopus.req('Request log', ['foo', 'bar']);
logtopus.req('Request log', null);
logtopus.req('Request log', true);
logtopus.req('Request log', false);
logtopus.req('Request log', undefined);

logtopus.sys('System log');
logtopus.sys('System log', 123);
logtopus.sys('System log', 'String arg');
logtopus.sys('System log', { foo: 'bar' });
logtopus.sys('System log', ['foo', 'bar']);
logtopus.sys('System log', null);
logtopus.sys('System log', true);
logtopus.sys('System log', false);
logtopus.sys('System log', undefined);

logtopus.warn('Warning log');
logtopus.warn('Warning log', 123);
logtopus.warn('Warning log', 'String arg');
logtopus.warn('Warning log', { foo: 'bar' });
logtopus.warn('Warning log', ['foo', 'bar']);
logtopus.warn('Warning log', null);
logtopus.warn('Warning log', true);
logtopus.warn('Warning log', false);
logtopus.warn('Warning log', undefined);

logtopus.error('Error log');
logtopus.error('Error log', 123);
logtopus.error('Error log', 'String arg');
logtopus.error('Error log', { foo: 'bar' });
logtopus.error('Error log', ['foo', 'bar']);
logtopus.error('Error log', null);
logtopus.error('Error log', true);
logtopus.error('Error log', false);
logtopus.error('Error log', undefined);
logtopus.error('Error log with funy chars \n \r \0 \b\b\b', undefined);
