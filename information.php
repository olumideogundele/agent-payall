<?php 
header("Access-Control-Allow-Origin: *");
 include("base/config/DB_config.php");
 include("base/includes/class_file.php");
 
    $data  = "";
  
	  $wallet_num = $_POST['wallet_number'];
	    $merchantcode = $_POST['merchantcode'];
 
  
 
 
 											$code = 0;


$myName = new Name();
 $code=$myName->showName($conn, "SELECT sum(`amount`) FROM `e_wallet` WHERE `walletno` = '$wallet_num' AND `status` = 1"); 
													
$coding=$myName->showName($conn, "SELECT sum(`amount`) FROM `main_commission` WHERE `sharing_party` = '$merchantcode' and `status` = 0"); 											
													 
													 $wallet =  number_format($code, 2);
													  $commission =  number_format($coding, 2);
													  
													  
													 if(isset($code) or isset($coding))
													 {
														 $resp= "Success";
													 
  $data = '{"resp":"'.$resp.'", "commission":"'.$commission.'", "wallet":"'.$wallet.'"}';
													 }
													 else
													 {
														 
														 $resp= "Failed";
													 
  $data = '{"resp":"'.$resp.'", "commission":"'.$code.'", "wallet":"'.$coding.'"}'; 
													 }
 
 
 
  echo json_encode($data);
 
  
  ?>