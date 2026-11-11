import { playPreparedAudio } from '../src/utils/preparedAudioPlayback';
import { preparedAudioSource } from '../src/data/preparedLessonAudio';
let mockListener;
const mockPlayer = { pause: jest.fn(), play: jest.fn(), release: jest.fn(), addListener: jest.fn((_, callback) => { mockListener=callback; return { remove: jest.fn() }; }) };
jest.mock('expo-audio', () => ({ createAudioPlayer: () => mockPlayer }));
beforeEach(() => { jest.clearAllMocks(); mockListener=undefined; });
test('missing prepared audio never pretends a recording is bundled', () => { expect(preparedAudioSource('Hello!')).toBeUndefined(); });
test('prepared audio grants completion only once after native loaded completion; cancellation ignores late callbacks', () => {
 const done=jest.fn(), error=jest.fn(); const stop=playPreparedAudio(1,.6,done,error);
 expect(mockPlayer.playbackRate).toBe(.6); expect(mockPlayer.shouldCorrectPitch).toBe(true);
 mockListener({ isLoaded:true, playing:true }); expect(done).not.toHaveBeenCalled();
 mockListener({ isLoaded:true, didJustFinish:true }); mockListener({ isLoaded:true, didJustFinish:true });
 expect(done).toHaveBeenCalledTimes(1); expect(mockPlayer.release).toHaveBeenCalledTimes(1); stop(); expect(error).not.toHaveBeenCalled();
 const stop2=playPreparedAudio(1,1,done,error); stop2(); mockListener({ isLoaded:true, didJustFinish:true }); expect(done).toHaveBeenCalledTimes(1);
});
test('prepared playback error releases resources and cannot later count as heard', () => {
 const done=jest.fn(), error=jest.fn(); playPreparedAudio(1,1,done,error); mockListener({ error:'unavailable' }); mockListener({ isLoaded:true,didJustFinish:true });
 expect(error).toHaveBeenCalledTimes(1); expect(done).not.toHaveBeenCalled(); expect(mockPlayer.release).toHaveBeenCalledTimes(1);
});
