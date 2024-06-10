import './App.css';
import Granular from './lib/Granular';
import { useEffect, useState } from 'react';
import { getContext, getAudioBuffer } from './lib/utils';
import { Layout, Slider, Space, ConfigProvider, Button, Spin, Upload } from 'antd';
import { CaretRightOutlined, CopyOutlined, PauseOutlined} from '@ant-design/icons';
import Waveform  from 'waveform-react';
const { Content } = Layout;

const layoutStyle = {
    height: '100vh',
    width: '100vw',
    padding: '15px',
    paddingTop: '35px',
};

const contentStyle = {
    height: '100%',
    width: '100%',
};

const buttonsSpaceStyle = {
    padding: '40px',
    
};

const waveformSpaceStyle = {
    width: '100%',
    height: '30%',
};

const waveformStyle = {
    primary: '#A44081',
    tertiary: '#30A7BF',
};

const sliderDivStyle = {
    height: 180,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
};

const sliderSpaceStyle = {
    height: '70%',
    width: '100%',

};

const sliderLabelStyle = {
    fontSize: 40,
    textAlign: 'center',
    color: '#A44081',
    margin: 0,
    padding: 0,
}


function App() {

    const [playerState, setPlayerState] = useState({
        attack: 20,
        sustain: 1000,
        release: 20,
        density: 32,
        // densitySlider: 500,
        buffer: null,
        context: null,
        gain: 0.3,
        output: null,
        pan: 1,
        playbackRate: 1,
        transpose: 0,
        position: 0.5,
        run: false,
        spread: 0.2,
    });

    useEffect(() => {

        const context = getContext();
        setPlayerState({
            ...playerState,
            context: context
        });

        // startMIDI();

        // eslint-disable-next-line
    }, []);

    const getFile = async (path = 'audio/test.mp3') => {
        const buffer = await getAudioBuffer(path, playerState.context);
        setPlayerState({ 
            ...playerState,
            buffer: buffer,
        });
    };

    const start = () => {
        setPlayerState({
            ...playerState,
            run: true
        });
    };

    const stop = () => {
        setPlayerState({
            ...playerState,
            run: false
        });
    };

    const setValue = (val, prop) => {
        setPlayerState({
            ...playerState,
            [prop]: Number.parseFloat(val)
        });
    };

    // const setDensityValue = (val) => {
    //     const minp = 0.1;
    //     var maxp = 1000;

    //     var minv = Math.log(minp);
    //     var maxv = Math.log(maxp);
    //     var scale = (maxv-minv) / (maxp-minp);
    //     const value = Math.exp(minv + scale * (val - minp));
    //     console.log("density", value);

    //     setPlayerState({
    //         ...playerState,
    //         density: Number.parseFloat(value),
    //         densitySlider: Number.parseFloat(val),
    //         sustain: 1000 / Number.parseFloat(value)
    //     });
    // };

    const setTranspose = (val) => {
        const power = val / 12
        const rate  = Math.pow(2, power);
        setPlayerState({
            ...playerState,
            transpose: Number.parseFloat(val),
            playbackRate: rate
        });
    };

    const uploadProps = {
        name: 'file',
        showUploadList: false,
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'done') {
                console.log(info.file.name);
                getFile('audio/' + info.file.name);
            }
        },
        };

    const granular = playerState.context?<Granular {...playerState} />:<Spin />;
    const playPause = playerState.run? 
        <Button icon={<PauseOutlined style={{ fontSize: '110px'}}/> } 
            ghost onClick={stop}/>:
        <Button icon={<CaretRightOutlined style={{ fontSize: '110px'}} />} 
            ghost onClick={start}/>;

    return (
        <ConfigProvider
            theme={{
                components: {
                    Slider: {
                        railSize: 25,
                        railBg: '#a085a0',
                        railHoverBg: '#a085a0',
                        trackBg: '#2AE979',
                        trackHoverBg: '#2AE979',
                        dotSize: 0,
                        handleSize: 0,
                        handleSizeHover: 0,
                        
                        
                    },
                    Layout: {
                        bodyBg: '#291E28',
                    },
                    Button: {
                        paddingBlock: 40,
                        paddingInline: 20,
                        defaultGhostColor: '#2AE979',
                        defaultHoverColor: '#2AE979',
                        defaultGhostBorderColor: '#291E28',
                        defaultHoverBorderColor: '#291E28',
                        borderColorDisabled: '#291E28',
                    }
                },
                token: {

                },
            }}>
            
            {granular}
            <Layout style={layoutStyle}>
                <Content style={contentStyle}>
                    <Space direction="horizontal" style={waveformSpaceStyle} size={50}>
                        <Space direction='vertical' size={5} style={buttonsSpaceStyle}>
                            <Upload {...uploadProps}>
                                <Button icon={<CopyOutlined style={{ fontSize: '60px'}}/>} 
                                    ghost />
                            </Upload>
                            {/* <Button icon={<CopyOutlined style={{ fontSize: '60px'}}/>} 
                                    ghost onClick={() => getFile()} /> */}
                            {playPause}
                        </Space>
                        <div style={waveformStyle}>
                            <Waveform 
                                buffer={playerState.buffer}
                                height={180}
                                width={1000}
                                plot={"line"}
                                markerStyle={{
                                    color: waveformStyle.tertiary,
                                    width: 2
                                }}
                                onPositionChange={pos => setValue(pos, 'position')}
                                position={playerState.position}
                                responsive={true}
                                showPosition={true}
                                waveStyle={{
                                    animate: true,
                                    color: waveformStyle.primary,
                                    pointWidth: 1
                                }}
                                />
                        </div>
                    </Space>
                    <Space direction="horizontal" style={sliderSpaceStyle} size={0}>
                        {/* <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.attack} onChange={val => setValue(val, 'attack')} 
                                min={5} max={500} step={1}/>
                            <h1 style={sliderLabelStyle}>A</h1>
                        </div>

                         */}
                        <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.density} onChange={val => setValue(val,'density')} 
                                min={1} max={64} step={1}/>
                            <h1 style={sliderLabelStyle}>D</h1>
                        </div>
                        <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.sustain} onChange={val => setValue(val,'sustain')} 
                                min={100} max={5000} step={1}/>
                            <h1 style={sliderLabelStyle}>S</h1>
                        </div>
                        <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.release} onChange={val => setValue(val,'release')} 
                                min={10} max={5000} step={1}/>
                            <h1 style={sliderLabelStyle}>R</h1>
                        </div>
                        
                        <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.transpose} onChange={val => setTranspose(val)} 
                                min={-24} max={24} step={1}/>
                            <h1 style={sliderLabelStyle}>T</h1>
                        </div>
                        <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.pan} onChange={val => setValue(val, 'pan')} 
                                min={-1} max={1} step={0.001}/>
                            <h1 style={sliderLabelStyle}>P</h1>
                        </div>
                        <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.spread} onChange={val => setValue(val,'spread')} 
                                min={0.0} max={2} step={0.001}/>
                            <h1 style={sliderLabelStyle}>S</h1> 
                        </div>
                        <div style={sliderDivStyle}>
                            <Slider vertical value={playerState.gain} onChange={val => setValue(val,'gain')} 
                                min={0} max={0.6} step={0.001}/>
                                <h1 style={sliderLabelStyle}>V</h1>
                        </div>
                
                    </Space>
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default App;
