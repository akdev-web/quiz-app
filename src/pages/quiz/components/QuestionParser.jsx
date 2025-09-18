import { useState } from "react";

export default function QuestionParser({onUpdate}) {
    const [textInput, setTextInput] = useState('');
    const [form, setForm] = useState({
        question: '',
        options: [],
        answer: '',
    });


    console.log('form', form);

    const parseInput = (input) => {
        const lines = input.split('\n');
        let question = '';
        let options = [];
        let answer = '';
        let ansIdx = 0;

        if(lines.length === 0) return;

        lines.forEach(line => {
            if(line.trim() === '') return;
            let isOption = /^[A-D]\)/i.test(line) || /^[1-4]\)/.test(line) || /^[A-D]\./i.test(line)  || /^[1-4]\./.test(line) || /^[A-D]\s/i.test(line) || /^[1-4]\s/.test(line);
            
            if (isOption) {
                options.push(line.replace(/^([A-Da-d1-4])[\)\.\s]/, '').trim());
            }else if(line.toLowerCase().startsWith('ans:') || line.toLowerCase().startsWith('answer:')){
                let ans = line.split(':')[1].trim().toLowerCase();
                if(/^[a-d]$/.test(ans)){
                    ansIdx = ['a','b','c','d'].indexOf(ans);
                    answer = options[ansIdx] || '';
                }
                if(/^[1-4]$/.test(ans)){
                    ansIdx = parseInt(ans)-1;
                    answer = options[ansIdx] || '';
                }
            }else{ 
                if(!isOption && ( !line.toLowerCase().startsWith('q:') || !line.toLowerCase().startsWith('question:')) ){
                    question = question.concat(' '+line.trim());
                }else if(line.toLowerCase().startsWith('q:') || line.toLowerCase().startsWith('question:')){
                    question = line.split(':')[1].trim();
                }
            }
        })

        setForm({ question, options, answer });
        onUpdate({ question, options, answer : ansIdx+1 });
    }



    const handleTextChange = (e) => {
        const value = e.target.value;
        setTextInput(value);
        parseInput(value);
    };

    return (
        <div className="p-4 space-y-4">
            <p className="text-sm text-[var(---color-text-xlight)]"> Paste your question below as plain text  OR fill the Fields</p>
            <textarea
                className="w-full p-2 border rounded"
                rows={6}
                placeholder={`Q: Your question?\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4\nAnswer: C`}
                value={textInput}
                onChange={handleTextChange}
            />
        </div>
    );
}