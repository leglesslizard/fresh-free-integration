<?php
?>
<div class="wrap">
	<h2>Welcome To My Plugin</h2>

<div class="modal fade in" role="dialog" aria-hidden="false" id="new_timeentry" ><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><h3 class="ellipsis modal-title" title="Add time">Add time</h3></div><div class="modal-body"><div id="timeentry_add">
			<form accept-charset="UTF-8" action="/helpdesk/tickets/390/time_sheets" class="timesheet_form ui-form" data-modal-id="new_timeentry" data-remote="true" id="add_new_time_entry" method="post" novalidate="novalidate"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"><input name="authenticity_token" type="hidden" value="WhAhKozM8HkolyO3Qa+X6cWHBFQqIMjm0cgHVwg/iRQ="></div>
				<input id="time_entry_workable_id" name="time_entry[workable_id]" type="hidden" value="9005487861">
				<dl>

					<dt><label for="time_entry_user_id">Agent</label> </dt>
					<dd>
						<div class="select2-container select2" id="s2id_time_entry_user_id"><a href="javascript:void(0)" class="select2-choice" tabindex="-1">   <span class="select2-chosen" id="select2-chosen-20">Joey Gilham</span><abbr class="select2-search-choice-close"></abbr>   <div class="select2-arrow" role="presentation"><b role="presentation"></b></div></a><label for="s2id_autogen20" class="select2-offscreen">Agent</label><input class="select2-focusser select2-offscreen" type="text" aria-haspopup="true" role="button" aria-labelledby="select2-chosen-20" id="s2id_autogen20"></div><select class="select2 select2-offscreen" id="time_entry_user_id" name="time_entry[user_id]" tabindex="-1" title="Agent"><option value="9006066244">Danny Peters</option>
							<option value="9006152662">Darren Hamilton</option>
							<option value="9006138143">Joey Gilham</option>
							<option value="9006066204" selected="selected">Neil Miller</option>
							<option value="9006138332">Rob Lowe</option></select>
					</dd>

					<dt><label for="time_entry_hhmm">Hours</label> </dt>
					<dd class="hours">
						<input autocomplete="off" class="auto hhmm_time_duration valid" id="time_entry_hhmm" name="time_entry[hhmm]" placeholder="HH:MM" size="6" type="text" aria-invalid="false">
						<label class="billing_hours floatr">
							<input name="time_entry[billable]" type="hidden" value="0"><input checked="checked" id="time_entry_billable" name="time_entry[billable]" type="checkbox" value="1">
							Billable
						</label>
						<div class="tip">Enter time in HH:MM or decimals (like 1:30 or 1.5 for an hour and 30 minutes). Leave this blank to start the auto-timer. </div>
					</dd>

					<dt><label for="time_entry_executed_at">On</label> </dt>
					<dd>
						<input class="auto executed_at datepicker hasDatepicker" id="executed_at_new" name="time_entry[executed_at]" readonly="readonly" size="10" type="text" value="23 Mar, 2016">
					</dd>

					<dt><label for="time_entry_note">Note</label> </dt>
					<dd>
						<textarea class="paragraph auto-height valid" cols="40" id="time_entry_note" name="time_entry[note]" rows="2" aria-invalid="false"></textarea>
					</dd>
				</dl>


			</form><div id="timeentry_apps_add" class="ui-form hide" style="display: block;">

			</div></div>
	</div><div class="modal-footer"><a href="#" data-dismiss="modal" class="btn" id="new_timeentry-cancel">Close</a><a href="#" data-submit="modal" class="btn btn-primary" id="new_timeentry-submit" data-start-text="Start Timer">Start Timer</a></div></div>
</div>