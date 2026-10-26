import React, {useState} from 'react';
import {Text, TextInput, StyleSheet} from 'react-native';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react-native';
import LessonViewport from '../src/components/lesson/LessonViewport';
import {lessonPages} from '../src/utils/lessonPages';
import {summarizeEvidence} from '../src/utils/lessonEvidence';
jest.mock('../src/components/lesson/LessonSurface',()=>({ink:{violet:'#a8f'}}));
afterEach(cleanup);
const layout=async(id,height)=>act(async()=>fireEvent(screen.getByTestId(id),'layout',{nativeEvent:{layout:{height,width:390,x:0,y:0}}}));
test('a fixed card fits without vertical scrolling or extra navigation',async()=>{
 const view=await render(<LessonViewport resetKey="a" onHeight={()=>{}}><Text>Tapşırıq</Text></LessonViewport>);
 await layout('lesson-fixed-viewport',550);await layout('lesson-card-content',430);
 expect(JSON.stringify(view.toJSON())).not.toContain('RCTScrollView');
 expect(screen.queryByLabelText('Kartın davamını göstər')).not.toBeOnTheScreen();
});
test('overflow pages preserve an answer and never advance the lesson',async()=>{
 let mounts=0;
 function Answer(){const [value,setValue]=useState(()=>{mounts++;return 'Hello';});return <TextInput accessibilityLabel="cavab" value={value} onChangeText={setValue}/>;}
 const view=await render(<LessonViewport resetKey="a" onHeight={()=>{}}><><Text>Birinci hissə</Text><><Answer/><Text>Son hissə</Text></></></LessonViewport>);
 await layout('lesson-fixed-viewport',400);await layout('lesson-card-content',780);
 await act(async()=>fireEvent.changeText(screen.getByLabelText('cavab'),'Hi'));
 await act(async()=>fireEvent.press(screen.getByLabelText('Kartın davamını göstər')));
 expect(StyleSheet.flatten(screen.getByTestId('lesson-card-content').props.style).top).toBeLessThan(0);
 expect(screen.getByLabelText('cavab').props.value).toBe('Hi');expect(mounts).toBe(1);
 await view.rerender(<LessonViewport resetKey="b" onHeight={()=>{}}><Text>Yeni kart</Text></LessonViewport>);
 expect(StyleSheet.flatten(screen.getByTestId('lesson-card-content').props.style).top).toBe(-0);
});
test.each([180,320,500,700])('large text pages cover all content at viewport %s',viewport=>{
 const total=1860, pages=lessonPages(total,viewport,[{y:0,height:180},{y:188,height:900},{y:1096,height:764}]);
 expect(pages[0]).toBe(0);expect(pages.at(-1)+viewport).toBe(total);
 for(let i=1;i<pages.length;i++){expect(pages[i]).toBeGreaterThan(pages[i-1]);expect(pages[i]).toBeLessThanOrEqual(pages[i-1]+viewport);}
});
test('text help cannot count as listening; other real listening evidence remains intact',()=>{
 const result=summarizeEvidence([
 {resolved:true,evidence:{input:'written',assisted:true,listening:true,technicalText:false,transcriptShown:true}},
 {resolved:true,evidence:{input:'spoken',assisted:false,listening:true,technicalText:false}},
 {resolved:true,evidence:{input:'written',assisted:true,listening:false,technicalText:true}},
 ]);
 expect(result).toMatchObject({written:2,spoken:1,textHelp:1,technicalText:1,listeningIndependent:1,listeningAssisted:0});
});
