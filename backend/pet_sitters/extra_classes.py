from django.contrib.postgres.forms import DateTimeRangeField


class CustomDateTimeRangeField(DateTimeRangeField):
    def __init__(self, *args, **kwargs):
        kwargs['input_formats'] = [
            '%Y-%m-%d %H:%M:%S',  # Example format: 2024-10-27 13:45:00
            '%Y-%m-%dT%H:%M:%S',  # Example format: 2024-10-27T13:45:00
            '%d-%m-%Y %H:%M',     # Example format: 27-10-2024 13:45
            # Add any additional custom formats here
        ]
        super().__init__(*args, **kwargs)