/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
      let n=height.length;
      let i=0, j=n-1;
      let maxAre=0;
      while(i<j){
        let minHeith=Math.min(height[i],height[j]);
        let area= minHeith * (j-i);
        maxAre=Math.max(area, maxAre)
        if(height[i]<height[j]){
            ++i;
        }else{
            --j;
        }
      }
    return maxAre;
};