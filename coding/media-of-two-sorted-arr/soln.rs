impl Solution {
  pub fn find_median_sorted_arrays(arr1: Vec<i32>, arr2: Vec<i32>) -> f64 {
      let left1 = arr1[0];
      let mid1 = arr1[(arr1.len() / 2).ceil()];
      let right1 = arr1[arr.len() - 1];
      let left2 = arr2[0];
      let mid2 = arr2[(arr2.len() / 2).ceil()];
      let right2 = arr2[arr.len() - 1];
      dbg!(left1, mid1, right1, left2, mid2, right2);
  }
}

pub(crate) fn main() {
  let arr1 = vec![1,2];
  let arr2 = vec![3,4];
  Solution.find_median_sorted_arrays(arr1, arr);
}