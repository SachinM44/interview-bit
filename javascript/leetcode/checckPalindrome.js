/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
   //use 2 pointer here 
   let n=s.length;
   let j=n-1;
   let i=0;
   while(i<j){
    if(s[i]!=s[j]) return false;
    i=i+1
    j=j+1
   }
   return true 
};