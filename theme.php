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
		// Stack::add( 'template_stylesheet', array(Site::get_url('theme') . '/css/jquery.vectormap.css', 'screen'), 'vectormapstyle' );
		// Stack::add( 'template_stylesheet', array(Site::get_url('theme') . '/css/style.css', 'screen'), 'style', array('vectormapstyle') );
		Stack::add( 'template_stylesheet', array(Site::get_url('theme') . '/css/bootstrap.min.css', 'screen'), 'bootstrap', array() );
		Stack::add( 'template_stylesheet', array(Site::get_url('theme') . '/css/lifemap.css', 'screen'), 'lifemap', array('bootstrap') );
		
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/d3.js', 'd3' );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/underscore.js', 'underscore' );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/paper.js', 'paper' );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/bootstrap.min.js', 'bootstrap', array('jquery') );

		// Stack::add( 'template_header_javascript', 'https://www.google.com/jsapi', 'google' );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/jscrollpane.js', 'jscrollpane', array('jquery') );
		// Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/jquery.vectormap.js', 'vectormap', array('jquery') );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/jquery.subwaymap.js', 'subwaymap', array('jquery') );
		// Stack::add( 'template_header_javascript', Site::get_url('theme') . '/maps/world.js', 'worldmap', array('vectormap') );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/jquery.smooth-scroll.js', 'smooth-scroll', array('jquery') );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/waypoints.jquery.js', 'waypoints', array('jquery') );
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/main.js', 'main', array('jquery', 'jscrollpane', 'subwaymap'));
		Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/lifemap.js', 'lifemap', array('jquery', 'paper', 'underscore', 'bootstrap'));
		
	}
	
	/**
	 * Our shortcode for the amazing subway experience
	 */
	function filter_shortcode_experience($content, $code, $attrs, $context)
	{
		$items = Experience::get_all();
		
		$locations = array(
			'Everywhere' => 'Everywhere'
		);
		
		foreach ($items as $item) {
			if (isset($item['location'])) {
				$locations[$item['location']] = $item['location'];
			} else {
				$item['location'] = 'Everywhere';
			}
		}
		
		$this->assign('life_items', $items);
		$this->assign('locations', $locations);
		
		return $this->fetch('lifemap');
				
		// return HabariDateTime::date_create()->format(isset($attrs['format']) ? $attrs['format'] : 'M j, Y');
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
	
	/**
	 * Modify publish form
	 */
	public function action_form_publish($form, $post)
	{

		$header = $form->publish_controls->append('fieldset', 'header', _t('Theme'));

		$header->append('checkbox', 'is_bragger', 'null:null', _t('Use bragger'), 'tabcontrol_checkbox');
		$header->is_bragger->value = $post->info->is_bragger;
		
		$header->append( 'select', 'columns', 'null:null', _t( 'Column Style' ), array( 'content+sidebar' => 'Content & Sidebar', 'content' => 'Content Only'), 'tabcontrol_select' );
		$header->columns->value = $post->info->columns;

		$header->append('textarea', 'left_box', 'null:null', _t('Left Box'), 'tabcontrol_textarea');
		$header->left_box->value = $post->info->left_box;
		$header->left_box->raw = true;

		$header->append('textarea', 'right_box', 'null:null', _t('Right Box'), 'tabcontrol_textarea');
		$header->right_box->value = $post->info->right_box;
		$header->right_box->raw = true;

	}

	/**
	 * Save our data to the database
	 */
	public function action_publish_post( $post, $form )
	{		
		$post->info->left_box = $form->left_box->value;
		$post->info->right_box = $form->right_box->value;
		$post->info->is_bragger = $form->is_bragger->value;
		$post->info->columns = $form->columns->value;
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
		
		if( isset( $theme->posts ) && count( $theme->posts ) == 1 )
		{
			$post = $theme->posts;
		}
		else
		{
			$post = false;
		}
				
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
		$banner = array(
			'greeting' => '<h1>Hello.</h1><p>My name is <strong>Morgante Pell</strong>.</p>',
			'definition' => false
		);
				
		if( $post )
		{
			if( isset( $post->info->left_box ) && $post->info->left_box != '') $banner['greeting'] = $post->info->left_box;
			if( isset( $post->info->right_box ) && $post->info->right_box != '') $banner['definition'] = $post->info->right_box;
		}
		
		$theme->banner = $banner;
		
		if( $post && $post->info->is_bragger )
		{
			Stack::add( 'template_stylesheet', array(Site::get_url('theme') . '/css/bragger.css', 'screen'), 'bragger', array('style') );
			Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/bragger.js', 'bragger', array( 'jquery', 'd3') );
		}
		
		// Utils::debug( $post->info->right_box, $banner );
		// exit;
	}

}


?>
