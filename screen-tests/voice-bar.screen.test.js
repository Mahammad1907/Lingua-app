import React from 'react';
import {AppState} from 'react-native';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react-native';
import WrittenAnswerInput from '../src/components/lesson/WrittenAnswerInput';
import LessonVoiceInput from '../src/components/lesson/LessonVoiceInput';
import VoicePracticeRecorder from '../src/components/lesson/VoicePracticeRecorder';
const mockRecorder={isRecording:false,currentTime:2,uri:'file://draft.m4a',getStatus:jest.fn(()=>({isRecording:mockRecorder.isRecording,metering:mockMeter})),prepareToRecordAsync:jest.fn(async()=>{}),record:jest.fn(()=>{mockRecorder.isRecording=true;}),stop:jest.fn(async()=>{mockRecorder.isRecording=false;})};
const mockPlayer={pause:jest.fn(),replace:jest.fn(),seekTo:jest.fn(async()=>{}),play:jest.fn()};
let mockGranted=true, mockMeter=-20, mockEngine=null;
jest.mock('expo-audio',()=>({AudioModule:{requestRecordingPermissionsAsync:jest.fn(async()=>({granted:mockGranted}))},RecordingPresets:{HIGH_QUALITY:{}},setAudioModeAsync:jest.fn(async()=>{}),useAudioRecorder:()=>mockRecorder,useAudioPlayer:()=>mockPlayer,useAudioPlayerStatus:()=>({playing:false})}));
jest.mock('expo-speech',()=>({stop:jest.fn(async()=>{})}));
jest.mock('../src/utils/speechEngine',()=>({getSpeechEngine:()=>mockEngine}));
jest.mock('../src/hooks/useReducedMotion',()=>({useReducedMotion:()=>true}));
jest.mock('../src/components/lesson/LessonSurface',()=>{const {View,Text,Pressable}=require('react-native');return {ink:{text:'#fff',muted:'#aaa',violet:'#b9f',orange:'#fa0'},LessonIcon:()=>null,SoundMark:()=>null,LessonButton:({label,onPress,disabled})=><Pressable onPress={onPress} disabled={disabled}><Text>{label}</Text></Pressable>};});
jest.mock('../src/components/lesson/ParticleWave',()=>{const {View}=require('react-native');return props=><View testID="capture-wave" {...props}/>;});
beforeEach(()=>{jest.useFakeTimers();jest.clearAllMocks();mockRecorder.isRecording=false;mockGranted=true;mockMeter=-20;mockEngine=null;AppState.currentState='active';});
afterEach(()=>{cleanup();jest.useRealTimers();});
const press=async(name)=>act(async()=>fireEvent.press(screen.getByRole('button',{name})));
const poll=async()=>act(async()=>jest.advanceTimersByTime(130));
test('compact fallback records, replays and re-records without manufacturing an assessed answer',async()=>{
 const busy=jest.fn();await render(<VoicePracticeRecorder compact onBusyChange={busy}/>);
 expect(screen.getByTestId('compact-voice-bar')).toBeOnTheScreen();
 expect(screen.queryByText('Səsli məşq et',{exact:true})).not.toBeOnTheScreen();
 await press('Danışmaq üçün toxun');await poll();expect(mockRecorder.record).toHaveBeenCalledTimes(1);
 expect(screen.queryByTestId('capture-wave')).not.toBeOnTheScreen();
 await press('Dayandır');await poll();expect(mockPlayer.replace).toHaveBeenCalledWith({uri:'file://draft.m4a'});
 await press('Yazını dinlə');expect(mockPlayer.play).toHaveBeenCalledTimes(1);
 await press('Yenidən danış');await poll();expect(mockRecorder.record).toHaveBeenCalledTimes(2);
 expect(screen.getByText('Səsini yaz və dinlə · Avtomatik yoxlanmır')).toBeOnTheScreen();
});
test('closing voice expansion stops recording and keeps the existing written value',async()=>{
 const final=jest.fn(),mode=jest.fn();
 await render(<WrittenAnswerInput value="Hello" onChange={()=>{}} onVoiceFinal={final} disabled={false} onBusyChange={()=>{}} onFocus={()=>{}} onVoiceModeChange={mode}/>);
 await press('Cavabını mikrofonla de');await act(async()=>jest.advanceTimersByTime(1));
 await press('Danışmaq üçün toxun');await poll();expect(mockRecorder.isRecording).toBe(true);
 await press('Səsli paneli bağla');
 expect(screen.queryByTestId('compact-voice-bar')).not.toBeOnTheScreen();
 expect(mockRecorder.stop).toHaveBeenCalled();expect(final).not.toHaveBeenCalled();
 expect(mode.mock.calls.map(c=>c[0])).toEqual([true,false]);
 expect(screen.getByLabelText('Cavabını ingiliscə yaz').props.value).toBe('Hello');
});
test('microphone permission failure stays recoverable inside the small panel',async()=>{
 mockGranted=false;await render(<VoicePracticeRecorder compact/>);await press('Danışmaq üçün toxun');
 expect(screen.getByText(/Mikrofon icazəsi verilmədi/)).toBeOnTheScreen();expect(mockRecorder.record).not.toHaveBeenCalled();
 mockGranted=true;await press('Danışmaq üçün toxun');await poll();expect(mockRecorder.record).toHaveBeenCalledTimes(1);
});

test('raw practice stops after speech and silence, then delivers once without a Send press',async()=>{
 const received=jest.fn();await render(<VoicePracticeRecorder compact autoSend onRecorded={received}/>);
 await press('Danışmaq üçün toxun');await poll();mockMeter=-90;
 await act(async()=>jest.advanceTimersByTime(1900));await poll();
 expect(received).toHaveBeenCalledTimes(1);expect(received.mock.calls[0][0]).toMatchObject({uri:'file://draft.m4a',duration:2});
 await act(async()=>jest.advanceTimersByTime(5000));expect(received).toHaveBeenCalledTimes(1);
 expect(screen.queryByText('Göndər',{exact:true})).not.toBeOnTheScreen();
});
test('silence is not automatically delivered as speech',async()=>{
 mockMeter=-90;const received=jest.fn();await render(<VoicePracticeRecorder compact autoSend onRecorded={received}/>);
 await press('Danışmaq üçün toxun');await act(async()=>jest.advanceTimersByTime(8200));await poll();
 expect(received).not.toHaveBeenCalled();expect(screen.getByText('Danışıq alınmadı. Yenidən danış.')).toBeOnTheScreen();
});
test('suspending a recording never auto-submits it',async()=>{
 const received=jest.fn();const view=await render(<VoicePracticeRecorder compact autoSend onRecorded={received}/>);
 await press('Danışmaq üçün toxun');await poll();
 await view.rerender(<VoicePracticeRecorder compact autoSend suspended onRecorded={received}/>);
 await act(async()=>jest.advanceTimersByTime(10));await poll();expect(received).not.toHaveBeenCalled();
});
function engine(){
 const listeners=new Map();
 return {addListener:(name,fn)=>{listeners.set(name,fn);return{remove:()=>listeners.delete(name)};},emit:(name,event)=>listeners.get(name)?.(event),abort:jest.fn(),stop:jest.fn(),start:jest.fn(),isRecognitionAvailable:()=>true,supportsOnDeviceRecognition:()=>true,supportsRecording:()=>false,requestMicrophonePermissionsAsync:async()=>({granted:true})};
}
test('a final recognized phrase auto-submits exactly once; partial text alone cannot submit',async()=>{
 mockEngine=engine();const final=jest.fn(()=>null);await render(<LessonVoiceInput compact onFinal={final} onBusyChange={()=>{}}/>);
 await press('Danışmaq üçün toxun');
 await act(async()=>mockEngine.emit('result',{isFinal:false,results:[{transcript:'Hello',confidence:.9}]}));expect(final).not.toHaveBeenCalled();
 await act(async()=>mockEngine.emit('result',{isFinal:true,results:[{transcript:'Hello',confidence:.9}]}));
 await act(async()=>mockEngine.emit('end'));expect(final).toHaveBeenCalledTimes(1);expect(final.mock.calls[0][0]).toMatchObject({text:'Hello',edited:false});
 await act(async()=>mockEngine.emit('end'));expect(final).toHaveBeenCalledTimes(1);expect(screen.queryByText('Göndər',{exact:true})).not.toBeOnTheScreen();
});
test('low-confidence recognition never auto-submits an invented language answer',async()=>{
 mockEngine=engine();const final=jest.fn(()=>null);await render(<LessonVoiceInput compact onFinal={final} onBusyChange={()=>{}}/>);await press('Danışmaq üçün toxun');
 await act(async()=>mockEngine.emit('result',{isFinal:true,results:[{transcript:'help',confidence:.1}]}));await act(async()=>mockEngine.emit('end'));expect(final).not.toHaveBeenCalled();
});
