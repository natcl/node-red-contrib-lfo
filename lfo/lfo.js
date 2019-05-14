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
        node.chunksize = parseInt(config.chunksize || 1);
        node.chunked = config.chunked || false;
        node.chunk = [];

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
                
                // Clear the data chunk array
                node.chunk.length = 0;
                
                return;
            }

            if (!node.lfo) {
                node.time = new clock();
                node.lfo = setInterval(function() {
                    var sample;
                    
                    if (node.waveform === 'sine') {
                        sample = osc.sine(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'saw') {
                        sample = osc.saw(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'saw_i') {
                        sample =  osc.saw_i(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'triangle') {
                        sample = osc.triangle(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'square') {
                        sample = osc.square(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    if (node.waveform === 'sig') {
                        sample = osc.sig(node.time.sinceBeginNS() / 1e9, node.frequency);
                    }
                    
                    if (node.chunked) {
                        node.chunk.push(sample);
                        
                        if (node.chunk.length === node.chunksize) {
                            // When chunked output has reached the specified chunk size, a single output message will
                            // be send (containing the array of collected samples)
                            msg.payload = node.chunk;
                            node.send(msg);

                            // Clear the data chunk array
                            node.chunk.length = 0
                        }
                    }
                    else {
                        // When no chunked output, an output message will be triggered for every sample
                        msg.payload = sample;
                        node.send(msg);
                    }
                }, node.samplingrate);
            }
        });

        node.on('close', function() {
            if (node.lfo) {
                clearInterval(node.lfo);
                node.lfo = null;
            }
            
            // Clear the data chunk array
            node.chunk.length = 0
        });
    }
    RED.nodes.registerType("lfo-node", LFONode);
};
