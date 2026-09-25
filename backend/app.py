from flask import Flask, jsonify, request
from flask_cors import CORS
from model import db, Task

app = Flask(__name__)

CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()

    return jsonify([
        {
            "id": str(task.id),
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "created_date": task.created_date.isoformat(),
        }

        for task in tasks
    ])


@app.route('/api/tasks', methods=['POST'])
def create_task():
    task = Task()
    task.title = request.json['title']
    task.description = request.json['description']
    task.status = request.json['status']

    if task.description == '':
        return jsonify({
            "error": "no description provided"
        })

    db.session.add(task)
    db.session.commit()

    return jsonify({
        "id": str(task.id),
        "title": task.title,
        "status": task.status,
        'created_date': task.created_date.isoformat(),
    })


@app.route('/api/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    task = Task.query.get(task_id)

    if task is None:
        return jsonify({
            "error": "Task not found"
        }), 404

    data = request.get_json()


    if 'title' in data:
        task.title = data['title']

    if 'description' in data:
        task.description = data['description']

    if 'status' in data:
        task.status = data['status']

    db.session.commit()

    return jsonify ({
        "title": task.title,
        "description": task.description,
        'status': task.status,
    })

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)

    if task is None:
        return jsonify({
            "error": "Task not found"
        }), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({})

if __name__ == '__main__':
    app.run(port=8000, debug=True)