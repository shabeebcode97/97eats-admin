"use strict";(self["webpackChunk_97eats_admin"]=self["webpackChunk_97eats_admin"]||[]).push([[513],{3513:(t,n,e)=>{e.r(n),e.d(n,{default:()=>v});var o=e(3673);function c(t,n,e,c,i,u){const l=(0,o.up)("example-component"),a=(0,o.up)("q-page");return(0,o.wg)(),(0,o.j4)(a,{class:"row items-center justify-evenly"},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{title:"Example component",active:"",todos:t.todos,meta:t.meta},null,8,["todos","meta"])])),_:1})}e(71);var i=e(2323);function u(t,n,e,c,u,l){return(0,o.wg)(),(0,o.iD)("div",null,[(0,o._)("p",null,(0,i.zw)(t.title),1),(0,o._)("ul",null,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.todos,(e=>((0,o.wg)(),(0,o.iD)("li",{key:e.id,onClick:n[0]||(n[0]=(...n)=>t.increment&&t.increment(...n))},(0,i.zw)(e.id)+" - "+(0,i.zw)(e.content),1)))),128))]),(0,o._)("p",null,"Count: "+(0,i.zw)(t.todoCount)+" / "+(0,i.zw)(t.meta.totalCount),1),(0,o._)("p",null,"Active: "+(0,i.zw)(t.active?"yes":"no"),1),(0,o._)("p",null,"Clicks on todos: "+(0,i.zw)(t.clickCount),1)])}var l=e(1959);function a(){const t=(0,l.iH)(0);function n(){return t.value+=1,t.value}return{clickCount:t,increment:n}}function s(t){const n=(0,l.Fl)((()=>t.value.length));return{todoCount:n}}const r=(0,o.aZ)({name:"CompositionComponent",props:{title:{type:String,required:!0},todos:{type:Array,default:()=>[]},meta:{type:Object,required:!0},active:{type:Boolean}},setup(t){return Object.assign(Object.assign({},a()),s((0,l.Vh)(t,"todos")))}});r.render=u;const d=r,p=(0,o.aZ)({name:"PageIndex",components:{ExampleComponent:d},setup(){const t=(0,l.iH)([{id:1,content:"ct1"},{id:2,content:"ct2"},{id:3,content:"ct3"},{id:4,content:"ct4"},{id:5,content:"ct5"}]),n=(0,l.iH)({totalCount:1200});return{todos:t,meta:n}}});var m=e(4379),w=e(7518),C=e.n(w);p.render=c;const v=p;C()(p,"components",{QPage:m.Z})}}]);