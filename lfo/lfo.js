module.exports = function(RED) {
    function LFONode(config) {
        const osc = require('oscillators');
        const clock = require('since-when');

        RED.nodes.createNode(this, config);
        var node = this;
        node.lfo = null;

        node.waveform = config.waveform;
        node.frequency = config.frequency;
        node.samplingrate = config.samplingrate;

        node.on('input', function(msg) {

            if (!isNaN(msg.payload)) {
                node.frequency = msg.payload;
                return;
            }

            if (msg.hasOwnProperty('waveform')) {
                node.waveform = msg.waveform;
                return;
            }

            if (msg.payload === 'stop') {
                if (node.lfo) {
                    clearInterval(node.lfo);
                    node.lfo = null;
                }
                return;
            }

            if (!node.lfo) {
                node.time = new clock();
                node.lfo = setInterval(function() {
                    if (node.waveform === 'sine') {
                        msg.payload = osc.sine(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'saw') {
                        msg.payload = osc.saw(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'saw_i') {
                        msg.payload =  osc.saw_i(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'triangle') {
                        msg.payload = osc.triangle(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'square') {
                        msg.payload = osc.square(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'sig') {
                        msg.payload = osc.sig(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    node.send(msg);
                }, node.samplingrate);
            }
        });

        node.on('close', function() {
            if (node.lfo) {
                clearInterval(node.lfo);
                node.lfo = null;
            }
        });
    }
    RED.nodes.registerType("lfo-node", LFONode);
};
