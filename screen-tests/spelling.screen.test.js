import {assessPacketAnswer} from '../src/utils/packetAnswer';
import {RecordingEndpoint} from '../src/utils/recordingEndpoint';
test('accepted typos carry exact correction metadata without loosening the policy',()=>{
 const rule={answers:['Hello!','Hi!'],goals:['greet']};
 expect(assessPacketAnswer('hellp',rule)).toMatchObject({status:'correct',spellingCorrections:[{before:'hellp',after:'hello'}]});
 expect(assessPacketAnswer('hello',rule).spellingCorrections).toBeUndefined();
 expect(assessPacketAnswer('help',rule).status).not.toBe('correct');
 expect(assessPacketAnswer('hellp',rule,true).spellingCorrections).toBeUndefined();
});
test('recording endpoint tolerates brief pauses, avoids silence and sends once',()=>{
 const e=new RecordingEndpoint();e.begin(0);expect(e.sample(-20,100)).toBeNull();expect(e.sample(-80,1500)).toBeNull();expect(e.sample(-20,1600)).toBeNull();expect(e.sample(-80,3400)).toBe('send');expect(e.sample(-80,5000)).toBeNull();
 e.begin(0);expect(e.sample(-90,8100)).toBe('empty');expect(e.heardVoice).toBe(false);
 e.begin(0);e.sample(-20,100);e.cancel();expect(e.sample(-90,10000)).toBeNull();
});
