import {summarizeEvidence} from '../src/utils/lessonEvidence';
test('text help cannot count as listening; other real listening evidence remains intact',()=>{
 const result=summarizeEvidence([
 {resolved:true,evidence:{input:'written',assisted:true,listening:true,technicalText:false,transcriptShown:true}},
 {resolved:true,evidence:{input:'spoken',assisted:false,listening:true,technicalText:false}},
 {resolved:true,evidence:{input:'written',assisted:true,listening:false,technicalText:true}},
 ]);
 expect(result).toMatchObject({written:2,spoken:1,textHelp:1,technicalText:1,listeningIndependent:1,listeningAssisted:0});
});
