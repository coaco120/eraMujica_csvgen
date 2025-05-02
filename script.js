// 素质、能力、装着物、曲目等下拉或多选列表数据  
const talentList = [  
    "处女","反抗的","成熟","自尊心高","自制的","习得快","调合知识","无关心",  
    "易湿","不越过底线","贞操观念","羞涩","舌使","猫舌","灵巧的指尖",  
    "擅长捆绑","污臭敏感","否定快感","魅惑","淫壶","Ｃ敏感","Ｖ敏感","Ｂ敏感","美脚"  
];  
const abilityList = [  
    "顺从","欲望","技巧","Ｃ感觉","Ｖ感觉","Ａ感觉","Ｂ感觉","奉仕精神",  
    "露出癖","百合气质","ＢＬ气质","受虐气质","自慰中毒","精液中毒","百合中毒",  
    "痛苦中毒","捆绑中毒","会话","爱抚","道具","性交","羞耻","奉仕","施虐","异常","奴役"  
];  
// 只能选1~5整数  
const abilityRange = [0,1,2,3,4,5];  

const bgmNameNoList =['１','２','３','４','５','６'];

const equipMeta = [  
    { key: "配饰", items: ["黑色鸭舌帽","墨镜","发带","华丽的黑金披肩","红色发带","领带","面具"] },  
    { key: "袜子", items: ["短袜","红色长筒过膝袜","过膝袜","分趾袜","吊帶丝袜"] },  
    { key: "下半身内衣", items: ["衬裤","内裤","短裤","连裤袜","缠腰布"] },  
    { key: "上半身内衣", items: ["胸罩","吊带背心","裹胸布","Ｔ衬衫"] },  
    { key: "下半身外套", items: ["长裙","格仔裙","双排扣短裤","裤子","深色的月之森百摺裙","羽丘的绿色格仔裙"] },  
    { key: "上半身外套", items: ["白色T衫","丝带蝶结外衣","马甲及衬衣","月之森制服外套","羽丘灰色制服外套"] },  
    { key: "全身外套", items: ["和服","过宽的白色衬衣","可爱的红白色连衣裙","花咲川学生校服","深色西装","Oblivionis全身服","Doloris全身服"] }  
];  

const songList = [  
    "Symbol III：Water","Mas?uerade Rhapsody Re?uest","Choir ‘S’ Choir","黒のバースデイ",  
    "ふたつの月 ～Deep Into The Forest～","Angles","Flower of Life","Lucidum","Silence"  
];  

window.onload = function() {  
    // 生成素质multi checkbox  
    const talentArea = document.getElementById('talentArea');  
    talentList.forEach(t=>{  
        const btn=document.createElement('button');  
        btn.className = 'talentBtn';  
        btn.type = "button";  
        btn.textContent = t;  
        btn.onclick = ()=>btn.classList.toggle('selected');  
        talentArea.appendChild(btn);  
    });  

    // 生成能力select  
    const abilityArea = document.getElementById('abilityArea');  
    abilityList.forEach((abl,i)=>{  
        abilityArea.innerHTML += `<label>${abl}</label>  
        <select id="abl_${i}">  
            ${abilityRange.map(v=>`<option value="${v}">${v}</option>`).join('')}  
        </select><br>`;  
    });  

    // 生成装着物单选按钮  
    document.getElementById('equipArea').innerHTML = equipMeta.map((eq, idx)=>{  
        return `  
        <label>${eq.key}</label>  
        <select id="equip_${idx}">  
            <option value="0">（无）</option>  
            ${eq.items.map((item, j)=>`<option value="${j+1}">${item}</option>`).join('')}  
        </select>  
        `;  
    }).join("<br>");  

    // 生成曲目输入 下拉  
    document.getElementById("songArea").innerHTML =  
        Array(6).fill(0).map((_,i)=>  
            `<label>曲${i+1}</label>  
                <select id='song${i+1}'>  
                <option value="">请选择</option>  
                ${songList.map(s=>`<option value="${s}">${s}</option>`).join("")}  
                </select><br>`  
        ).join('');  

    // 相性输入添加功能  
    document.getElementById('relationArea').appendChild(relationRow());  

    document.getElementById('addRelation').onclick = function(){  
        document.getElementById('relationArea').appendChild(relationRow());  
    };  

    // 生成 CSV 按钮  
    document.getElementById('generateBtn').onclick = function(){  
        // 依需求拼装csv文本  
        let csv = '\ufeff';  
        const v = id=>document.getElementById(id).value;  

        csv+=`番号,${v('charNo')}\r\n`;  
        csv+=`名前,${v('charName')}\r\n`;  
        csv+=`呼び名,${v('callName')}\r\n`;  
        csv+=`基礎,体力,${v('tairyoku')}\r\n基礎,气力,${v('kiryoku')}\r\n`;  
        // 素质  
        Array.from(document.getElementsByClassName('talentBtn')).forEach(btn=>{  
            if(btn.classList.contains('selected'))  
                csv+=`素質,${btn.textContent},\r\n`;  
        });  
        // 能力  
        abilityList.forEach((abl,i)=>{  
            csv+=`能力,${abl},${v("abl_"+i)}\r\n`;  
        });  
        // 经验  
        csv += `経験,自慰経験,${v('exp1')}\r\n経験,道具使用経験,${v('exp2')}\r\n`;  
        // 相性  
        Array.from(document.getElementById('relationArea').children).forEach(row=>{  
            const no = row.querySelector('.relNum').value;  
            const val = row.querySelector('.relVal').value;  
            if(no && val){  
                csv+=`相性,${no},${val},\r\n`;  
            }  
        });  
        // 装着物  
        equipMeta.forEach((eq,idx)=>{  
            csv+=`装着物,${eq.key},${v('equip_'+idx)},\r\n`;  
        });  
        // 角色情报  
        csv += `CSTR,外号,${v('nickname')}\r\n`;  
        csv += `CSTR,登场名,${v('displayName')}\r\n`;  
        csv += `CSTR,单词,${v('englishName')}\r\n`;  
        for(let i=1;i<=6;i++){  
            let sval = v('song'+i);  
            if(i==1 && !sval){  
                alert("必须选择“曲1”");  
                return;  
            }  
            csv += `CSTR,曲${bgmNameNoList[i-1]},${sval}\r\n`;  
        }  
        // 称呼列表  
        csv += `CSTR,称呼列表,${v('callList')}\r\n`;  
        
        // 生成文件并下载  
        let blob = new Blob([csv], {type: "text/csv"});  
        let url = URL.createObjectURL(blob);  
        let a = document.getElementById('downloadLink');  
        a.href = url;  
        a.download = `Chara${v('charNo')}_${v('charName')||'未命名'}.csv`;  
        a.style.display = '';  
        a.textContent = "点击下载CSV文件";  
        a.click();  
    };  
};  

function relationRow(){  
    let div = document.createElement('div');  
    div.innerHTML = `  
        <input type="number" class="relNum" placeholder="角色编号">  
        <input type="number" class="relVal" placeholder="相性值">  
        <button type="button" onclick="this.parentElement.remove()">删除</button>  
    `;  
    return div;  
}