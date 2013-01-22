<?php

class Orion extends Theme
{
	
	/**
	 * Include our custom templates 
	 **/
	public function action_init_theme()
	{
		$this->add_template('contactcontrol_text', dirname(__FILE__) . '/formcontrols/contactcontrol_text.php');
		$this->add_template('contactcontrol_textarea', dirname(__FILE__) . '/formcontrols/contactcontrol_textarea.php');
		$this->add_template('contactcontrol_submit', dirname(__FILE__) . '/formcontrols/contactcontrol_submit.php');
	}
	
	public function action_template_header( $theme )
	{
		Stack::add( 'template_header_javascript', Site::get_url('scripts') . '/jquery.js', 'jquery' );
		Stack::add( 'template_header_javascript', 'http://d3js.org/d3.v3.min.js', 'd3' );

		Stack::add( 'template_stylesheet', array(Site::get_url('theme') . '/css/style.css', 'screen'), 'style' );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/jscrollpane.js', 'jscrollpane', array('jquery') );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/jquery.smooth-scroll.js', 'smooth-scroll', array('jquery') );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/waypoints.jquery.js', 'waypoints', array('jquery') );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/main.js', 'main', array('jquery', 'jscrollpane') );
		
	}	
	
	/**
	 * User our controls for the contact form
	 **/
	public function action_jambo_build_form( $form, $jambo )
	{
		foreach( $form->controls as $control )
		{
			switch( $control->name )
			{
				case 'jambo_name':
					$control->help = 'Who are you?';
					$control->class[] = 'name';
					$control->template = 'contactcontrol_text';
					break;
				case 'jambo_email':
					$control->help = 'I won&apos;t share this with anyone.';
					$control->class[] = 'email';
					$control->add_validator( 'validate_required', _t( 'Your email is required.' ) );
					$control->template = 'contactcontrol_text';
					break;
				case 'jambo_message':
					$control->template = 'contactcontrol_textarea';
					$control->help = 'What do you want to say?';
					break;
				case 'jambo_submit':
					$control->template = 'contactcontrol_submit';
					$control->caption = _t( 'Send' );
					break;
				default:
					Utils::debug( $control->name );
					break;
			}
		}
	}
	
	public function relative_datetime( $timestamp )
	{
		$difference = time() - $timestamp;
	    $periods = array("sec", "min", "hour", "day", "week", "month", "years", "decade");
	    $lengths = array("60","60","24","7","4.35","12","10");

	    if ($difference > 0) { // this was in the past
	        $ending = "ago";
	    } else { // this was in the future
	        $difference = -$difference;
	        $ending = "to go";
	    }       
	    for($j = 0; $difference >= $lengths[$j]; $j++) $difference /= $lengths[$j];
	    $difference = round($difference);
	    if($difference != 1) $periods[$j].= "s";
	    $text = "$difference $periods[$j] $ending";
	    return $text;
	}
	
	public function action_add_template_vars()
	{
		
		$theme = $this;
		
		if(isset($theme->orion_page)):
			return;
		endif;
						
		if(is_object($theme->request)) {
			foreach($theme->request as $name => $status) {
				if($status == TRUE) {
					$request = $name;
				}
			}
		} else {
			$request= '';
		}
				
		$theme->request= $request;
				
		if( $theme->request == 'display_page' ) {
			$theme->orion_page = $theme->post->slug;
			$theme->orion_title = $theme->post->title;
		}
		elseif( $theme->request == 'display_lifestream' ) {
			$theme->orion_page = 'lifestream';
			$theme->orion_title = 'Lifestream';
		}
		else {
			$theme->orion_page= 'home';
			$theme->orion_title= NULL;
		}
		
		$pages = Posts::get( array( 'content_type' => Post::type('page'), 'status' => Post::status('published'), 'tag' => 'primary', 'orderby' => 'pubdate ASC') );
		
		foreach( $pages as $page ) {
			if( $theme->orion_page == $page->slug) {
				$page->active = true;
			}
		}
		
		$theme->navigation = $pages;
		
		// default banner
		$theme->banner = array(
			'greeting' => '<h1>Hello.</h1><p>My name is <strong>Morgante Pell</strong>.</p>',
			'definition' => false
		);
		
	}

}


?>
