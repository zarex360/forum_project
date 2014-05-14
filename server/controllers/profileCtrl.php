<?php

class ProfileCtrl extends core\base\BaseCtrl
{
	protected function editProfile()
	{
		$model = new ProfileModel();
		
		$auth = new core\auth\Auth();

		if($auth->checkUser())
		{
			$result = $model->editProfile($this->requestData);
		}
		else
		{
			$result = false;
		}
		
		$result = $this->response->add('editProfileResponse', $result);
	}

}